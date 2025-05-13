"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Candy,
  User,
  ThumbsUp,
  ThumbsDown,
  ArrowDown,
  SendIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import Header from "@/components/header";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface ChatResponse {
  response: string;
  timestamp: string;
  link_to_contact: boolean;
  response_time: number;
}

interface Metadata {
  timestamp?: string;
  topic: string;
  userClickToAction: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

interface Message {
  role: string;
  message: string;
  timestamp: string;
  link_to_contact?: boolean;
  feedback?: string | null;
  response_time?: number | null;
  isExpanded?: boolean;
}

interface ChatSaveRequest {
  metadata: Metadata;
  messages: Message[];
  session_id: string;
}

const MAX_MESSAGE_LENGTH = 500;

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      message:
        "Halo! Saya adalah CANDY, asisten virtual Astra Digital. Apa yang ingin Anda ketahui tentang layanan dan solusi digital kami?",
      feedback: null,
      link_to_contact: false,
      timestamp: new Date().toISOString(),
      isExpanded: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    contact: "",
  });
  const [anonymous, setAnonymous] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }

    // Generate a new session ID on each page load
    const currentSessionId: string = uuidv4();
    setSessionId(currentSessionId);
    // Optionally, store the session ID in localStorage if you want to persist it across sessions
    // localStorage.setItem("sessionId", currentSessionId);

    const handleBeforeUnload = async () => {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    if (sessionId) {
      handleSaveChat();
    }
  }, [messages, sessionId]);

  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const validateContactForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      contact: "",
    };

    if (!anonymous && !contactInfo.name.trim()) {
      newErrors.name = "Nama wajib diisi";
      valid = false;
    }

    if (!anonymous && !contactInfo.email.trim()) {
      newErrors.contact = "Email wajib diisi";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleContactSubmit = () => {
    if (validateContactForm()) {
      setShowContactForm(false);
      setIsFirstMessage(false);

      // Capture the current input value here
      const currentInput = input;

      const userMessage = {
        role: "user",
        message: currentInput,
        feedback: null,
        timestamp: new Date().toISOString(),
        isExpanded: false,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      sendChatMessage(currentInput); // Use the captured value here
    }
  };

  const handleAnonymousChat = () => {
    setAnonymous(true);
    setShowContactForm(false);
    setIsFirstMessage(false);

    // Capture the current input value here
    const currentInput = input;

    const userMessage = {
      role: "user",
      message: currentInput,
      timestamp: new Date().toISOString(),
      isExpanded: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    sendChatMessage(currentInput); // Use the captured value here
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim()) return;

    if (isFirstMessage) {
      setShowContactForm(true);
      return;
    }

    const userMessage = {
      role: "user",
      message: input,
      timestamp: new Date().toISOString(),
      isExpanded: false,
    };
    console.log("User message:", userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    sendChatMessage(input);
  };

  const sendChatMessage = async (message: string) => {
    const formattedMessage = `${contactInfo.name}: ${message}`;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactInfo.name ? contactInfo.name : "User",
          message: formattedMessage,
          history: messages.map((msg) => ({
            role: msg.role,
            message: msg.message,
            timestamp: msg.timestamp,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      console.log("Response data:", data);
      const botResponse = {
        role: "model",
        message: data.response,
        feedback: null,
        link_to_contact: data.link_to_contact,
        timestamp: data.timestamp,
        isExpanded: false,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleFeedback = (index: number, type: "positive" | "negative") => {
    setMessages((prev) => {
      return prev.map((msg, i) => {
        if (i === index) {
          if (msg.feedback === type) {
            return { ...msg, feedback: null };
          } else {
            return { ...msg, feedback: type };
          }
        } else {
          return msg;
        }
      });
    });
  };

  const handleContactFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, service: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setShowContactDialog(false);
        setFormState({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
          service: "",
        });
      }, 5000);
    }, 1500);
  };

  const handleSaveChat = async () => {
    if (!sessionId) {
      console.warn("Session ID not yet available, skipping save.");
      return;
    }
    try {
      const metadata: Metadata = {
        topic: "General",
        userClickToAction: false,
        name: contactInfo.name || undefined,
        email: contactInfo.email || undefined,
        phone: contactInfo.phone || undefined,
      };

      const requestBody: ChatSaveRequest = {
        metadata: metadata,
        messages: messages,
        session_id: sessionId,
      };

      console.log("Saving chat with session ID:", sessionId);
      console.log(JSON.stringify(requestBody));

      const response = await fetch(`${API_BASE_URL}/chats/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `Failed to save chat: ${response.status} - ${JSON.stringify(
            errorBody
          )}`
        );
      }

      console.log("Chat saved successfully!");
    } catch (error: any) {
      console.error("Error saving chat:", error.message);
    }
  };

  const toggleExpandMessage = (index: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  const containsContactUsMessage = (message: string) => {
    return (
      message.toLowerCase().includes("hubungi tim kami") ||
      message.toLowerCase().includes("silakan hubungi") ||
      message.toLowerCase().includes("informasi lebih lanjut") ||
      message.toLowerCase().includes("informasi yang lebih spesifik")
    );
  };

  const suggestedQuestions = [
    "Apa saja layanan yang ditawarkan Astra Digital?",
    "Ceritakan tentang Digital Intelligence",
    "Apa itu Data Product?",
    "Bagaimana cara menghubungi tim Astra Digital?",
    "Apa keunggulan Astra Digital dibandingkan kompetitor?",
    "Siapa saja klien Astra Digital?",
  ];

  const CheckCircle = ({ size = 24, ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">CANDY</h1>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              Asisten Digital Astra yang Siap Membantumu!
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Tanya apa pun seputar layanan, produk, dan solusi inovatif Astra
              Digital. Dapatkan respons cepat dan akurat kapan saja dan di mana
              saja!
            </p>
          </div>
        </section>

        {/* Chatbot Section */}
        <section className="py-10 flex-grow bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-blue-800 text-white p-4">
                <div className="flex items-center">
                  <Candy className="mr-2 h-6 w-6" />
                  <h2 className="text-xl font-semibold">
                    CANDY - Astra Digital Assistant
                  </h2>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto p-4 relative"
              >
                {/* Suggested Questions at the beginning */}

                {messages.map((message, index) => {
                  const isLongMessage =
                    message.message.length > MAX_MESSAGE_LENGTH;
                  const displayMessage =
                    isLongMessage && !message.isExpanded
                      ? message.message.substring(0, MAX_MESSAGE_LENGTH) +
                        "..."
                      : message.message;

                  return (
                    <div
                      key={index}
                      className={`mb-4 flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.role === "model" ? (
                            <Candy className="mr-2 h-4 w-4" />
                          ) : (
                            <User className="mr-2 h-4 w-4" />
                          )}
                          <span className="font-semibold">
                            {message.role === "model"
                              ? "CANDY"
                              : anonymous
                              ? "Anda"
                              : contactInfo.name}
                          </span>
                        </div>

                        {displayMessage.split("\n").map((line, index) => (
                          <p key={index} className="">
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
                          </p>
                        ))}
                        {isLongMessage && (
                          <button
                            onClick={() => toggleExpandMessage(index)}
                            className="text-blue-500 hover:underline text-sm"
                          >
                            {message.isExpanded
                              ? "Baca lebih sedikit"
                              : "Baca selengkapnya"}
                          </button>
                        )}

                        {/* Contact Us button - based on link_to_contact */}
                        {message.role === "model" && message.link_to_contact && (
                          <div className="mt-2">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => setShowContactDialog(true)}
                            >
                              <SendIcon className="mr-2 h-3 w-3" /> Hubungi Kami
                            </Button>
                          </div>
                        )}

                        {/* Feedback buttons for bot messages only */}
                        {message.role === "model" && (
                          <div className="flex items-center mt-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-1 h-6 w-6 rounded-full ${
                                message.feedback === "positive"
                                  ? "bg-green-100 text-green-600"
                                  : "text-gray-400 hover:text-green-600"
                              }`}
                              onClick={() => handleFeedback(index, "positive")}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="sr-only">Helpful</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-1 h-6 w-6 rounded-full ml-1 ${
                                message.feedback === "negative"
                                  ? "bg-red-100 text-red-600"
                                  : "text-gray-400 hover:text-red-600"
                              }`}
                              onClick={() => handleFeedback(index, "negative")}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span className="sr-only">Not Helpful</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="mb-4 flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                      <div className="flex items-center mb-1">
                        <Candy className="mr-2 h-4 w-4" />
                        <span className="font-semibold">CANDY</span>
                      </div>
                      <p>Mengetik...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-[2px] left-[50%] transform -translate-x-1/2 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors z-10"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendMessage}>
                {messages.length <= 1 && (
                  <div className="mb-2 p-4 ">
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          onClick={() => {
                            setInput(question);
                          }}
                          type="submit"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 p-4 flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik pesan Anda di sini..."
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Form Dialog */}
        <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Informasi Kontak</DialogTitle>
              <DialogDescription>
                Silakan isi informasi kontak Anda untuk melanjutkan percakapan
                dengan CANDY.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama*
                </Label>
                <Input
                  id="name"
                  value={contactInfo.name}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, name: e.target.value })
                  }
                  className="col-span-3"
                  disabled={anonymous}
                />
                {errors.name && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value })
                  }
                  className="col-span-3"
                  disabled={anonymous}
                />
                {errors.contact && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {errors.contact}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telepon
                </Label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  className="col-span-3"
                  disabled={anonymous}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4 flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={anonymous}
                    onCheckedChange={(checked) => {
                      setAnonymous(checked === true);
                      if (checked) {
                        setContactInfo({ name: "", email: "", phone: "" });
                        setErrors({ name: "", contact: "" });
                      }
                    }}
                  />
                  <label
                    htmlFor="anonymous"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Saya ingin bertanya secara anonim
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Batal
                </Button>
              </DialogClose>
              <div className="flex gap-2">
                {!anonymous && (
                  <Button type="button" onClick={handleContactSubmit}>
                    Lanjutkan
                  </Button>
                )}
                {anonymous && (
                  <Button type="button" onClick={handleAnonymousChat}>
                    Lanjutkan sebagai Anonim
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hubungi Kami Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Hubungi Kami</DialogTitle>
              <DialogDescription>
                Silakan isi formulir di bawah ini untuk menghubungi tim kami.
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center my-4">
                <div className="flex justify-center mb-4 text-green-500">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pesan Terkirim!</h3>
                <p className="text-gray-600">
                  Terima kasih telah menghubungi kami. Tim kami akan segera
                  menghubungi Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nama Lengkap *</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      value={formState.name}
                      onChange={handleContactFormChange}
                      required
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleContactFormChange}
                      required
                      placeholder="Masukkan alamat email Anda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Nomor Telepon</Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleContactFormChange}
                      placeholder="Masukkan nomor telepon Anda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-company">Perusahaan</Label>
                    <Input
                      id="contact-company"
                      name="company"
                      value={formState.company}
                      onChange={handleContactFormChange}
                      placeholder="Masukkan nama perusahaan Anda"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-service">Layanan yang Diminati</Label>
                  <Select
                    value={formState.service}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="contact-service">
                      <SelectValue placeholder="Pilih layanan yang Anda minati" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">
                        Pengembangan Aplikasi Web
                      </SelectItem>
                      <SelectItem value="mobile-development">
                        Pengembangan Aplikasi Mobile
                      </SelectItem>
                      <SelectItem value="digital-consulting">
                        Konsultasi Digital
                      </SelectItem>
                      <SelectItem value="data-analytics">
                        Analisis Data & AI
                      </SelectItem>
                      <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                      <SelectItem value="digital-marketing">
                        Digital Marketing
                      </SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subjek *</Label>
                  <Input
                    id="contact-subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleContactFormChange}
                    required
                    placeholder="Masukkan subjek pesan Anda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Pesan *</Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    value={formState.message}
                    onChange={handleContactFormChange}
                    required
                    placeholder="Masukkan pesan Anda"
                    rows={4}
                  />
                </div>

                <DialogFooter>
                  <Link href="/contact" passHref>
                    <Button variant="outline">
                      <span className="flex items-center">
                        Informasi Kontak Kami
                      </span>
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
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
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" /> Kirim Pesan
                      </span>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        {/* <Button onClick={handleSaveChat}>Save Chat</Button> */}
      </main>
    </>
  );
}
