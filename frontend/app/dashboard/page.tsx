"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogOut,
  Search,
  Eye,
  Upload,
  Folder,
  Bot,
  User,
  Trash2,
  FileText,
  FilePlus,
  Download,
  MousePointer,
  ThumbsUp,
  ArrowDown,
  ArrowUp,
  MessageSquare,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TagCloud } from "react-tagcloud"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { addDays, format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import { chatHistoryData, userActivityData, ctaClicksData, satisfactionData, responseTimeData, wordCloudData, knowledgeBaseFiles } from "@/data/dummy"
import Header from "@/components/header"

// Function to parse time string to Date object
const parseTimeString = (timeString: string): Date => {
  try {
    // Try parsing assuming ISO format
    return parseISO(timeString)
  } catch (error) {
    // Fallback to new Date if parseISO fails
    console.error("Error parsing time string:", timeString, error)
    const date = new Date(timeString)
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", timeString)
      return new Date() // Return current date as fallback
    }
    return date
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChats, setFilteredChats] = useState(chatHistoryData)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [uploadedFiles, setUploadedFiles] = useState(knowledgeBaseFiles)
  const [isUploading, setIsUploading] = useState(false)
  const itemsPerPage = 10

  // Sorting states
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [topicFilter, setTopicFilter] = useState<string | null>(null)

  // Add these state variables after the existing ones
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 3, 1), // April 1, 2025
    to: new Date(2025, 3, 30), // April 30, 2025
  })
  const [timePeriod, setTimePeriod] = useState("monthly")
  const [maxTokens, setMaxTokens] = useState([2000])
  const [showContactOnly, setShowContactOnly] = useState(false)

  // Chatbot settings
  const [chatbotPrompt, setChatbotPrompt] = useState(
    "Anda adalah asisten AI Astra Digital bernama CANDY yang membantu pengguna dengan informasi tentang layanan dan produk Astra Digital. Anda harus selalu ramah, informatif, dan profesional.",
  )
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash")
  const [temperature, setTemperature] = useState([0.7])
  const [topK, setTopK] = useState([40])


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Memoized filtered and sorted chats
  const processedChats = useMemo(() => {
    let chatData = [...chatHistoryData]

    // Filter by topic
    if (topicFilter) {
      chatData = chatData.filter((chat) => chat.topic.toLowerCase().includes(topicFilter.toLowerCase()))
    }

    // Filter by search term (user, topic, id)
    if (searchTerm) {
      chatData = chatData.filter(
        (chat) =>
          chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      chatData = chatData.filter((chat) => {
        const chatDate = parseTimeString(chat.time)
        return chatDate >= dateRange.from! && chatDate <= dateRange.to!
      })
    }

    // Filter by contact
    if (showContactOnly) {
      chatData = chatData.filter((chat) => chat.contact !== "")
    }

    // Sort the data
    if (sortColumn) {
      chatData.sort((a, b) => {
        let valueA: any = a[sortColumn as keyof typeof a]
        let valueB: any = b[sortColumn as keyof typeof b]

        if (sortColumn === "time") {
          valueA = parseTimeString(a.time).getTime()
          valueB = parseTimeString(b.time).getTime()
        }

        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase()
          valueB = valueB.toLowerCase()
        }

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1
        }
        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return chatData
  }, [searchTerm, dateRange, showContactOnly, sortColumn, sortDirection, topicFilter])

  // Pagination logic
  const totalPages = Math.ceil(processedChats.length / itemsPerPage)
  const paginatedChats = processedChats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle file upload
  const handleFileUpload = () => {
    setIsUploading(true)

    // Get the file input element
    const fileInput = document.getElementById("file-upload") as HTMLInputElement

    // Simulate file upload delay
    setTimeout(() => {
      // Create a dummy file object with random details
      const fileTypes = ["pdf", "docx", "txt", "csv", "json"]
      const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)]
      const fileSize = (Math.random() * 5 + 0.5).toFixed(1)

      let fileName = "Document"
      // If a file was selected, use its name (for demo purposes)
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        fileName = fileInput.files[0].name
      } else {
        // Otherwise generate a random name
        fileName = `New Document ${Math.floor(Math.random() * 1000)}.${randomType}`
      }

      const newFile = {
        name: fileName,
        type: randomType,
        size: `${fileSize} MB`,
        date: `Uploaded on ${new Date().toLocaleDateString()}`,
      }

      setUploadedFiles([newFile, ...uploadedFiles])
      setIsUploading(false)

      // Reset the file input
      if (fileInput) fileInput.value = ""
    }, 1500)
  }

  // Handle file removal
  const handleFileRemove = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  // Custom renderer for word cloud tags
  const customRenderer = (tag: any, size: number, color: string) => (
    <span
      key={tag.value}
      style={{
        fontSize: `${size}px`,
        color,
        margin: "3px",
        padding: "3px",
        display: "inline-block",
        backgroundColor: `rgba(66, 153, 225, ${tag.count / 50})`,
        borderRadius: "5px",
      }}
    >
      {tag.value}
    </span>
  )

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcons = (column: string) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? (
        <ArrowUp className="h-4 w-4 ml-1 inline" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1 inline" />
      )
    }
    return null
  }

  const handleTopicClick = (topic: string) => {
    setTopicFilter(topic)
  }

  const clearTopicFilter = () => {
    setTopicFilter(null)
  }

  return (
    <>
    
    <Header />
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CANDY Dashboard</h1>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => {
              handleLogout()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="chat-history">Chat History</TabsTrigger>
            <TabsTrigger value="chatbot-settings">Chatbot Settings</TabsTrigger>
          </TabsList>

          {/* Analytics Tab (renamed from Overview) */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Date Range and Time Period Selection */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
              <div className="grid gap-2">
    <Label htmlFor="from-date">From</Label>
    <Input
      type="date"
      id="from-date"
      value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : null;
        setDateRange(prev => ({
          from: date || undefined,
          to: prev?.to || date || undefined
        }));
      }}
      className="w-[200px]"
    />
  </div>
  
        <div className="grid gap-2">
          <Label htmlFor="to-date">To</Label>
          <Input
            type="date"
            id="to-date"
            value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              setDateRange(prev => ({
                from: prev?.from || date || undefined,
                to: date || undefined
              }));
            }}
            className="w-[200px]"
          />
        </div>
          <div className="grid gap-1">

                <Label>Group data by</Label>
                <RadioGroup defaultValue="monthly" className="flex space-x-1 -pt-1" onValueChange={setTimePeriod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">Yearly</Label>
                  </div>
                </RadioGroup>
              </div>
              </div>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export to CSV
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className={`text-xs flex items-center mt-2 ${12 > 0 ? "text-green-500" : "text-red-500"}`}>
                    {12 > 0 ? "+" : ""}
                    {12}% from the previous month
                    {12 > 0 ? (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    A session is a unique chat conversation initiated by a user
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <User className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">843</div>

                  <p className={`text-xs flex mt-2 items-center ${5 > 0 ? "text-green-500" : "text-red-500"}`}>
                    {5 > 0 ? "+" : ""}
                    {5}% from the previous month
                    {5 > 0 ? (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    A lead is a chat session where the user provides their contact information
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total CTA</CardTitle>
                  <MousePointer className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">928</div>

                  <p className={`text-xs flex items-center mt-2 ${11 > 0 ? "text-green-500" : "text-red-500"}`}>
                    {11 > 0 ? "+" : ""}
                    {11}% from the previous month
                    {11 > 0 ? (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    CTA represents the total number of call-to-action buttons clicked by users from the chatbot
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
                  <ThumbsUp className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>

                  <p className={`text-xs flex items-center mt-2 ${-3 > 0 ? "text-green-500" : "text-red-500"}`}>
                    {-3 > 0 ? "+" : ""}
                    {-3}% from the previous month
                    {-3 > 0 ? (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Satisfaction represents the percentage of 'like' responses out of all 'like' and 'dislike' responses
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timePeriod === "daily"
                      ? "Daily Sessions"
                      : timePeriod === "monthly"
                        ? "Monthly Sessions"
                        : "Yearly Sessions"}
                  </CardTitle>
                  <CardDescription>
                    {timePeriod === "daily"
                      ? "Number of daily chat sessions initiated over the time period."
                      : timePeriod === "monthly"
                        ? "Number of monthly chat sessions initiated over the time period."
                        : "Number of yearly chat sessions initiated over the time period."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userActivityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <YAxis />
                      <Tooltip labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <Legend />
                      <Line
                        name="Active Users"
                        type="monotone"
                        dataKey="users"
                        stroke="#3182CE"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {timePeriod === "daily"
                      ? "Daily Call to Action Clicks"
                      : timePeriod === "monthly"
                        ? "Monthly Call to Action Clicks"
                        : "Yearly Call to Action Clicks"}
                  </CardTitle>
                  <CardDescription>
                    {timePeriod === "daily"
                      ? "Daily call to action click over the time period"
                      : timePeriod === "monthly"
                        ? "Monthly call to action clicks over the time period"
                        : "Yearly call to action clicks over the time period"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={ctaClicksData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <YAxis />
                      <Tooltip labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <Legend />
                      <Line
                        name="CTA clicks"
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3182CE"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {timePeriod === "daily"
                      ? "Daily User Satisfaction"
                      : timePeriod === "monthly"
                        ? "Monthly User Satisfaction"
                        : "Yearly User Satisfaction"}
                  </CardTitle>
                  <CardDescription>
                    {timePeriod === "daily"
                      ? "Daily average user satisfaction rate for chat responses over the time period."
                      : timePeriod === "monthly"
                        ? "Monthly user satisfaction rate for chat responses over the time period."
                        : "Yearly user satisfaction rate for chat responses over the time period."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={satisfactionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <YAxis />
                      <Tooltip labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <Legend />
                      <Line
                        name="User Satisfaction (%)"
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#3182CE"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {timePeriod === "daily"
                      ? "Daily Average Response Time"
                      : timePeriod === "monthly"
                        ? "Monthly Average Response Time"
                        : "Yearly Average Response Time"}
                  </CardTitle>
                  <CardDescription>
                    {timePeriod === "daily"
                      ? "Daily average response time of the chatbot over the time period."
                      : timePeriod === "monthly"
                        ? "Monthly average response time of the chatbot over the time period."
                        : "Yearly average response time of the chatbot over the time period."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={responseTimeData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <YAxis />
                      <Tooltip labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")} />
                      <Legend />
                      <Line
                        name="Response Time (s)"
                        type="monotone"
                        dataKey="time"
                        stroke="#FF0000"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
                <CardDescription>Most frequently asked topics</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">
                  <TagCloud
                    minSize={12}
                    maxSize={35}
                    tags={wordCloudData}
                    className="w-full h-full flex flex-wrap justify-center items-center"
                    renderer={customRenderer}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Analytics */}
          </TabsContent>

          {/* Chat History Tab */}

          {/* Chat History Tab */}
          <TabsContent value="chat-history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Chat History</CardTitle>
                    <CardDescription className="pt-2">
                      Recent conversations with CANDY
                      {topicFilter && (
                        <Button variant="link" size="sm" onClick={clearTopicFilter}>
                          (Filtered by topic: {topicFilter} - Clear)
                        </Button>
                      )}
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-12 pt-4">
                  <div className="grid gap-2 relative w-full">
                    <Label>Search</Label>
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search conversations by name or topic..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="from-date">From</Label>
                        <Input
                          type="date"
                          id="from-date"
                          value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setDateRange(prev => ({
                              from: date || undefined,
                              to: prev?.to || date || undefined
                            }));
                          }}
                          className="w-[200px]"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="to-date">To</Label>
                        <Input
                          type="date"
                          id="to-date"
                          value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setDateRange(prev => ({
                              from: prev?.from || date || undefined,
                              to: date || undefined
                            }));
                          }}
                          className="w-[200px]"
                        />
                      </div>
                      </div>
                    
                  <div className="flex items-center">
                    <Input
                      type="checkbox"
                      id="contact-only"
                      checked={showContactOnly}
                      onChange={(e) => setShowContactOnly(e.target.checked)}
                      className="mr-2 pt-2"
                    />
                    <Label htmlFor="contact-only">Leads Only</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-12 px-4 text-left font-medium">ID</th>
                          <th
                            className="h-12 px-4 text-left font-medium cursor-pointer hover:text-blue-500 hover:font-bold"
                            onClick={() => handleSort("user")}
                          >
                            User {getSortIcons("user")}
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium cursor-pointer hover:text-blue-500 hover:font-bold"
                            onClick={() => handleSort("time")}
                          >
                            Time {getSortIcons("time")}
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium cursor-pointer hover:text-blue-500 hover:font-bolde"
                            onClick={() => handleSort("topic")}
                          >
                            Topic {getSortIcons("topic")}
                          </th>
                          <th className="h-12 px-4 text-left font-medium">Contact</th>
                          <th className="h-12 px-4 text-left font-medium">Satisfaction</th>
                          <th className="h-12 px-4 text-left font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedChats.map((chat) => (
                          <tr key={chat.id} className="border-b">
                            <td className="p-4 align-middle">{chat.id}</td>
                            <td className="p-4 align-middle">{chat.user}</td>
                            <td className="p-4 align-middle">{format(parseTimeString(chat.time), "LLL dd, yyyy")}</td>
                            <td
                              className="p-4 align-middle cursor-pointer hover:text-blue-500 hover:font-semibold"
                              onClick={() => handleTopicClick(chat.topic)}
                            >
                              {chat.topic}
                            </td>
                            <td className="p-4 align-middle">{chat.contact || "-"}</td>
                            <td className="p-4 align-middle">{chat.satisfaction ? (<span>{chat.satisfaction}%</span>) :(<span>{"N/A"}</span>)}</td>
                            <td className="p-4 align-middle">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" /> Lihat
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Chat History</DialogTitle>
                                    <DialogDescription>
                                      {chat.id} - {chat.user} - {format(parseTimeString(chat.time), "LLL dd, yyyy")}
                                      {chat.contact && <div className="mt-1 text-sm">Contact: {chat.contact}</div>}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ScrollArea className="h-[500px] pr-4">
                                    <div className="space-y-6 py-2">
                                      {chat.conversation &&
                                        chat.conversation.map((msg, idx) => (
                                          <div
                                            key={idx}
                                            className={`flex ${
                                              msg.sender === "user" ? "justify-end" : "justify-start"
                                            }`}
                                          >
                                            <div
                                              className={`max-w-[80%] rounded-lg p-3 ${
                                                msg.sender === "user"
                                                  ? "bg-blue-600 text-white"
                                                  : "bg-gray-100 text-gray-800"
                                              }`}
                                            >
                                              <div className="flex items-center mb-1">
                                                {msg.sender === "user" ? (
                                                  <User className="mr-2 h-4 w-4" />
                                                ) : (
                                                  <Bot className="mr-2 h-4 w-4" />
                                                )}
                                                <span className="font-semibold">
                                                  {msg.sender === "user" ? chat.user : "CANDY"}
                                                </span>
                                                <span className="text-xs ml-2 opacity-70">{msg.time}</span>
                                              </div>
                                              <p>{msg.content}</p>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, processedChats.length)} of {processedChats.length} chats
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chatbot Settings Tab (renamed from Settings) */}
          <TabsContent value="chatbot-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Settings</CardTitle>
                <CardDescription>Configure your chatbot's behavior and knowledge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chatbot Prompt/Role */}
                <div className="space-y-2">
                  <Label htmlFor="chatbot-prompt">Chatbot Prompt (Role)</Label>
                  <Textarea
                    id="chatbot-prompt"
                    value={chatbotPrompt}
                    onChange={(e) => setChatbotPrompt(e.target.value)}
                    className="min-h-[120px]"
                    placeholder="Enter the system prompt for your chatbot..."
                  />
                  <p className="text-sm text-gray-500">
                    This prompt defines how your chatbot will behave and respond to users.
                  </p>
                </div>

                {/* LLM Model Selection */}
                <div className="space-y-2">
                  <Label htmlFor="llm-model">LLM Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="llm-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (Fast, Cost Efficient)</SelectItem>
                      <SelectItem value="gemini-2.0-pro">Gemini 2.0 Pro (Balanced Performance)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Select the language model that powers your chatbot.</p>
                </div>

                {/* Max Token Setting */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <span className="text-sm text-gray-500">{maxTokens}</span>
                  </div>
                  <Slider
                    id="max-tokens"
                    min={100}
                    max={4000}
                    step={100}
                    value={maxTokens}
                    onValueChange={setMaxTokens}
                  />
                  <p className="text-sm text-gray-500">
                    Maximum number of tokens to generate. Higher values allow for longer responses but may increase
                    costs.
                  </p>
                </div>

                {/* Temperature Setting */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Temperature</Label>
                    <span className="text-sm text-gray-500">{temperature}</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onValueChange={setTemperature}
                  />
                  <p className="text-sm text-gray-500">
                    Controls randomness: Lower values are more deterministic, higher values are more creative.
                  </p>
                </div>

                {/* Top-K Setting */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="top-k">Top-K</Label>
                    <span className="text-sm text-gray-500">{topK}</span>
                  </div>
                  <Slider id="top-k" min={1} max={100} step={1} value={topK} onValueChange={setTopK} />
                  <p className="text-sm text-gray-500">
                    Limits the model to consider only the top K most likely tokens at each step.
                  </p>
                </div>

                {/* File Manager */}
                <div className="space-y-2">
                  <Label>Knowledge Base Files</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Folder className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Context Files</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" /> Upload File
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload File</DialogTitle>
                            <DialogDescription>Upload a file to provide context for your chatbot.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold mb-2">Drag and drop file here</h3>
                              <p className="text-gray-500 mb-4">or click to browse files</p>
                              <Input id="file-upload" type="file" className="hidden" />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("file-upload")?.click()}
                              >
                                Browse Files
                              </Button>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT, CSV, JSON</p>
                              <p className="text-sm text-gray-500">Max size: 10MB</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleFileUpload} disabled={isUploading}>
                                {isUploading ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Uploading...
                                  </>
                                ) : (
                                  <>Upload</>
                                )}
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      {uploadedFiles.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FilePlus className="h-10 w-10 mx-auto mb-2" />
                          <p>No files uploaded yet</p>
                          <p className="text-sm">Upload files to provide context for your chatbot</p>
                        </div>
                      ) : (
                        uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white mr-3">
                                {file.type === "pdf" ? "PDF" : file.type === "docx" ? "DOC" : "TXT"}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {file.size} • {format(parseISO(file.date), "MMM dd, yyyy")}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleFileRemove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Upload files to provide context for your chatbot's responses.</p>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </>
  )
}
