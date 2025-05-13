"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Eye,
  Bot,
  User,
  Download,
  ArrowDown,
  ArrowUp,
  ThumbsUp,
  ThumbsDown, // Import ThumbsDown icon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { saveAs } from "file-saver";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Define the types based on your backend schemas
interface ChatItem {
  session_id: string;
  timestamp: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  satisfaction_rate: number;
  userClickToAction: boolean;
  topic: string;
}

interface ChatMessage {
  role: string;
  message: string;
  timestamp: string;
  link_to_contact?: boolean;
  feedback?: string | null; // Ensure feedback can be null or string
  response_time?: number;
}

interface ChatMetadata {
  timestamp: string;
  topic: string;
  userClickToAction: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

interface ChatDetailResponse {
  metadata: ChatMetadata;
  messages: ChatMessage[];
}

interface ChatsListResponse {
  total: number;
  page: number;
  limit: number;
  data: ChatItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function History() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [sortColumn, setSortColumn] = useState<string | null>("time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [showContactOnly, setShowContactOnly] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [totalChats, setTotalChats] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatDetailResponse | null>(
    null,
  );
  const [selectedUserCategory, setSelectedUserCategory] = useState("all");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiredTime");
    router.push("/login");
  };

  // Function to fetch chat history from the API
  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `${API_BASE_URL}/chats?`; // Removed pagination params

      if (sortColumn) {
        url += `&sort=${sortColumn}`;
        url += `&order=${sortDirection}`;
      }

      if (dateRange?.from) {
        url += `&start=${format(dateRange.from, "yyyy-MM-dd")}`;
      }
      if (dateRange?.to) {
        url += `&end=${format(dateRange.to, "yyyy-MM-dd")}`;
      }

      if (showContactOnly) {
        url += "&contactOnly=true";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatsListResponse = await response.json();
      setChatHistory(data.data);
      setTotalChats(data.total);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [sortColumn, sortDirection, dateRange, showContactOnly]); // Removed currentPage

  // Function to fetch chat detail by session_id
  const fetchChatDetail = async (session_id: string) => {
    setSelectedChat(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/chats/${session_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatDetailResponse = await response.json();
      console.log("Chat detail:", data);
      setSelectedChat(data);
    } catch (error) {
      console.error("Failed to fetch chat detail:", error);
    }
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcons = (column: string) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? (
        <ArrowUp className="h-4 w-4 ml-1 inline" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1 inline" />
      );
    }
    return null;
  };

  const handleTopicClick = (topic: string) => {
    setTopicFilter(topic);
  };

  const clearTopicFilter = () => {
    setTopicFilter(null);
  };

  const filteredChats = useMemo(() => {
    let filtered = [...chatHistory];

    // Remove anonymous chats
    // filtered = filtered.filter((chat) => chat.name !== null);

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (chat) =>
          chat.name?.toLowerCase().includes(lowerSearchTerm) ||
          chat.topic?.toLowerCase().includes(lowerSearchTerm) ||
          chat.session_id?.toLowerCase().includes(lowerSearchTerm),
      );
    }

    if (topicFilter) {
      filtered = filtered.filter((chat) =>
        chat.topic.toLowerCase().includes(topicFilter.toLowerCase()),
      );
    }

    // select user category
    if (selectedUserCategory === "leads") {
      filtered = filtered.filter((chat) => chat.name !== null);
    } else if (selectedUserCategory === "anonymous") {
      filtered = filtered.filter((chat) => chat.name === null);
    }

    // Back to page 1
    setCurrentPage(1);

    return filtered;
  }, [chatHistory, searchTerm, topicFilter, sortColumn, sortDirection, selectedUserCategory]);

  // Paginate the filtered chats
  const paginatedChats = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChats.slice(startIndex, endIndex);
  }, [filteredChats, currentPage, itemsPerPage]);

  const exportToCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "User",
          "Time",
          "Topic",
          "Contact",
          "Satisfaction",
          "User Click To Action",
        ],
        ...filteredChats.map((chat) => [
          chat.session_id,
          chat.name || "-",
          format(parseISO(chat.timestamp), "LLL dd, yyyy HH:mm"),
          chat.topic,
          chat.phone || "-",
          chat.satisfaction_rate ? chat.satisfaction_rate * 100 + "%" : "N/A",
          chat.userClickToAction ? "Yes" : "No",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    // Download the file
    saveAs(csvContent, "chat_history.csv");
  };

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
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportToCSV}
          >
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
                  setDateRange((prev) => ({
                    from: date || undefined,
                    to: prev?.to || date || undefined,
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
                  setDateRange((prev) => ({
                    from: prev?.from || date || undefined,
                    to: date || undefined,
                  }));
                }}
                className="w-[200px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="to-date">User Category</Label>
              <Select value={selectedUserCategory} onValueChange={setSelectedUserCategory}>
                <SelectTrigger id="user-category" className="w-40">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="leads">Leads Only</SelectItem>
                  <SelectItem value="anonymous">Anonymous Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                    onClick={() => handleSort("name")}
                  >
                    User {getSortIcons("name")}
                  </th>
                  <th
                    className="h-12 px-4 text-left font-medium cursor-pointer hover:text-blue-500 hover:font-bold"
                    onClick={() => handleSort("time")}
                  >
                    Time {getSortIcons("time")}
                  </th>
                  <th
                    className="h-12 px-4 text-left font-medium cursor-pointer hover:text-blue-500 hover:font-bold"
                    onClick={() => handleSort("topic")}
                  >
                    Topic {getSortIcons("topic")}
                  </th>
                  <th className="h-12 px-4 text-left font-medium">Contact</th>
                  <th className="h-12 px-4 text-left font-medium">
                    Satisfaction
                  </th>
                  <th className="h-12 px-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedChats.map((chat) => (
                  <tr key={chat.session_id} className="border-b">
                    <td className="p-4 align-middle">{chat.session_id}</td>
                    <td className="p-4 align-middle">{chat.name || "Anonymous Chat"}</td>
                    <td className="p-4 align-middle">
                      {format(parseISO(chat.timestamp), "LLL dd, yyyy HH:mm")}
                    </td>
                    <td
                      className="p-4 align-middle cursor-pointer hover:text-blue-500 hover:font-semibold"
                      onClick={() => handleTopicClick(chat.topic)}
                    >
                      {chat.topic}
                    </td>
                    <td className="p-4 align-middle">{chat.phone || "-"}</td>
                    <td className="p-4 align-middle">
                      {chat.satisfaction_rate ? (
                        <span>{chat.satisfaction_rate * 100}%</span>
                      ) : (
                        <span>{"N/A"}</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                            onClick={() => fetchChatDetail(chat.session_id)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Lihat
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Chat History</DialogTitle>
                            <DialogDescription>
                              {chat.session_id} - {chat.name} -{" "}
                              {format(parseISO(chat.timestamp), "LLL dd, yyyy HH:mm")}
                              {chat.phone && (
                                <span className="mt-1 text-sm">
                                  {" "}
                                  Contact: {chat.phone}
                                </span>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-6 py-2">
                              {selectedChat?.messages &&
                                selectedChat?.messages.map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex ${msg.role === "user"
                                      ? "justify-end"
                                      : "justify-start"
                                      }`}
                                  >
                                    <div
                                      className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                      <div className="flex items-center mb-1">
                                        {msg.role === "user" ? (
                                          <User className="mr-2 h-4 w-4" />
                                        ) : (
                                          <Bot className="mr-2 h-4 w-4" />
                                        )}
                                        <span className="font-semibold">
                                          {msg.role === "user" ? chat.name : "CANDY"}
                                        </span>
                                        <span className="text-xs ml-2 opacity-70">
                                          {format(parseISO(msg.timestamp), "LLL dd, yyyy HH:mm")}
                                        </span>
                                        {/* Add ThumbsUp icon if feedback is 'positive' */}
                                        {msg.feedback === 'positive' && (
                                          <ThumbsUp className="ml-2 h-4 w-4 text-green-500" />
                                        )}
                                        {/* Add ThumbsDown icon if feedback is 'negative' */}
                                        {msg.feedback === 'negative' && (
                                          <ThumbsDown className="ml-2 h-4 w-4 text-red-500" />
                                        )}
                                      </div>
                                      <p>{msg.message.split("\n").map((line, index) => (
                                        <span key={index} className="">
                                          {line
                                            .split(/(\*\*.*?\*\*|\*.*?\*)/)
                                            .map((part, i) => {
                                              if (
                                                part.startsWith("**") &&
                                                part.endsWith("**")
                                              ) {
                                                return (
                                                  <span key={i} className="font-bold">
                                                    {part.slice(2, -2)}
                                                  </span>
                                                );
                                              } else if (
                                                part.startsWith("*") &&
                                                part.endsWith("*")
                                              ) {
                                                return (
                                                  <span key={i} className="italic">
                                                    {part.slice(1, -1)}
                                                  </span>
                                                );
                                              }
                                              return <span key={i}>{part}</span>;
                                            })}
                                        </span>
                                      ))}
                                      </p>
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
            {Math.min(currentPage * itemsPerPage, filteredChats.length)} of{" "}
            {filteredChats.length} chats
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
              Page {currentPage} of {Math.ceil(filteredChats.length / itemsPerPage)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredChats.length / itemsPerPage),
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(filteredChats.length / itemsPerPage)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
