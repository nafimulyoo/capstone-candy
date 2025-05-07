"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Search,
  Eye,
  Bot,
  User,
  Download,
  ArrowDown,
  ArrowUp,

} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

import { format, parseISO } from "date-fns"

import type { DateRange } from "react-day-picker"



import { chatHistoryData, knowledgeBaseFiles } from "@/data/dummy"

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

export default function History() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
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

  const [showContactOnly, setShowContactOnly] = useState(false)


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
                      <td className="p-4 align-middle">{chat.satisfaction ? (<span>{chat.satisfaction}%</span>) : (<span>{"N/A"}</span>)}</td>
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
                                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                      <div
                                        className={`max-w-[80%] rounded-lg p-3 ${msg.sender === "user"
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
    )

}