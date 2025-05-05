"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Candy, User, ThumbsUp, ThumbsDown, ArrowDown, SendIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Halo! Saya adalah CANDY, asisten virtual Astra Digital. Apa yang ingin Anda ketahui tentang layanan dan solusi digital kami?",
      feedback: null, // null, 'up', or 'down'
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    contact: "",
  })
  const [anonymous, setAnonymous] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)

  // Contact form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    service: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle scroll events to show/hide the scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      // Show button if scrolled up at least 100px from bottom
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
      setShowScrollButton(isScrolledUp)
    }

    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll)
      return () => chatContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const validateContactForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      contact: "",
    }

    // Name is required unless anonymous
    if (!anonymous && !contactInfo.name.trim()) {
      newErrors.name = "Nama wajib diisi"
      valid = false
    }

    // Either email or phone is required unless anonymous
    if (!anonymous && !contactInfo.email.trim()) {
      newErrors.contact = "Email wajib diisi"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleContactSubmit = () => {
    if (validateContactForm()) {
      setShowContactForm(false)
      setIsFirstMessage(false)

      // Now proceed with sending the message
      const userMessage = { role: "user", content: input, feedback: null }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      // Simulate API call to get bot response
      setTimeout(() => {
        // This is a mock response. In a real application, you would call your AI service here.
        const botResponse = getBotResponse(input)

        // Add bot response to chat
        setMessages((prev) => [...prev, { role: "bot", content: botResponse, feedback: null }])
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleAnonymousChat = () => {
    setAnonymous(true)
    setShowContactForm(false)
    setIsFirstMessage(false)

    // Now proceed with sending the message
    const userMessage = { role: "user", content: input, feedback: null }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call to get bot response
    setTimeout(() => {
      // This is a mock response. In a real application, you would call your AI service here.
      const botResponse = getBotResponse(input)

      // Add bot response to chat
      setMessages((prev) => [...prev, { role: "bot", content: botResponse, feedback: null }])
      setIsLoading(false)
    }, 1000)
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // If this is the first message, show the contact form
    if (isFirstMessage) {
      setShowContactForm(true)
      return
    }

    // Add user message to chat
    const userMessage = { role: "user", content: input, feedback: null }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call to get bot response
    setTimeout(() => {
      // This is a mock response. In a real application, you would call your AI service here.
      const botResponse = getBotResponse(input)

      // Add bot response to chat
      setMessages((prev) => [...prev, { role: "bot", content: botResponse, feedback: null }])
      setIsLoading(false)

      // Scroll to bottom after new message
      setTimeout(() => scrollToBottom(), 100)
    }, 1000)
  }

  const handleFeedback = (index: number, type: "up" | "down") => {
    setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, feedback: type } : msg)))
  }

  // Handle contact form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, service: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setShowContactDialog(false)
        setFormState({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
          service: "",
        })
      }, 5000)
    }, 1500)
  }

  // Mock function to generate bot responses
  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase()

    if (input.includes("layanan") || input.includes("jasa")) {
      return "Astra Digital menawarkan berbagai layanan digital, termasuk Digital Ventures, Venture Building, Strategy & Consulting, Digital Marketing, Data Intelligence, dan Academy & Technology. Layanan mana yang ingin Anda ketahui lebih lanjut?"
    } else if (input.includes("digital ventures") || input.includes("investasi")) {
      return "Sejak tahun 2018, kami telah menyalurkan lebih dari USD 300 juta dalam bentuk pembiayaan kepada perusahaan rintisan teknologi di berbagai sektor, sebagai bagian dari agenda transformasi digital Grup."
    } else if (input.includes("venture building")) {
      return "Corporate Venture Building telah menjadi strategi penting bagi perusahaan, tidak hanya untuk mempertahankan pertumbuhan jangka panjang mereka namun juga untuk tetap relevan dengan pelanggan dan pemangku kepentingan lainnya."
    } else if (input.includes("harga") || input.includes("biaya")) {
      return "Harga layanan kami bervariasi tergantung pada kebutuhan spesifik proyek Anda. Kami menawarkan konsultasi gratis untuk membahas proyek Anda dan memberikan estimasi biaya. Silakan hubungi tim kami untuk informasi lebih lanjut."
    } else if (input.includes("kontak") || input.includes("hubungi")) {
      return "Anda dapat menghubungi kami melalui email di hello@astradigital.id atau mengunjungi halaman Kontak kami untuk informasi lebih lanjut. Untuk informasi yang lebih spesifik tentang kebutuhan Anda, silakan hubungi tim kami."
    } else if (input.includes("terima kasih")) {
      return "Sama-sama! Senang bisa membantu. Jika Anda memiliki pertanyaan lain, jangan ragu untuk bertanya."
    } else {
      return "Terima kasih atas pertanyaan Anda. Untuk informasi yang lebih spesifik, silakan hubungi tim kami untuk mendapatkan bantuan yang lebih personal."
    }
  }

  // Check if response contains contact us message
  const containsContactUsMessage = (message: string) => {
    return (
      message.toLowerCase().includes("hubungi tim kami") ||
      message.toLowerCase().includes("silakan hubungi") ||
      message.toLowerCase().includes("informasi lebih lanjut") ||
      message.toLowerCase().includes("informasi yang lebih spesifik")
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CANDY</h1>
           <h1 className="text-3xl md:text-4xl font-semibold mb-4">Asisten Digital Astra yang Siap Membantumu!</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Tanya apa pun seputar layanan, produk, dan solusi inovatif Astra Digital. Dapatkan respons cepat dan akurat kapan saja dan di mana saja!
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
                <h2 className="text-xl font-semibold">CANDY - Astra Digital Assistant</h2>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 relative">
              {/* Suggested Questions at the beginning */}


              {messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === "bot" ? <Candy className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                      <span className="font-semibold">{message.role === "bot" ? "CANDY" : "Anda"}</span>
                    </div>
                    <p>{message.content}</p>

                    {/* Contact Us button for bot messages that mention contacting */}
                    {message.role === "bot" && containsContactUsMessage(message.content) && (
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
                    {message.role === "bot" && (
                      <div className="flex items-center mt-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-6 w-6 rounded-full ${message.feedback === "up" ? "bg-green-100 text-green-600" : "text-gray-400 hover:text-green-600"}`}
                          onClick={() => handleFeedback(index, "up")}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span className="sr-only">Helpful</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-6 w-6 rounded-full ml-1 ${message.feedback === "down" ? "bg-red-100 text-red-600" : "text-gray-400 hover:text-red-600"}`}
                          onClick={() => handleFeedback(index, "down")}
                        >
                          <ThumbsDown className="h-3 w-3" />
                          <span className="sr-only">Not Helpful</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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

              {/* Floating scroll button */}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 left-1/2 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Chat Input */}
              <form onSubmit={handleSendMessage} >
              {messages.length <= 1 && (
                <div className="mb-2 p-4 ">
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="text-sm bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        onClick={() => {
                          setInput(question)
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading || !input.trim()}>
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
              Silakan isi informasi kontak Anda untuk melanjutkan percakapan dengan CANDY.
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
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                className="col-span-3"
                disabled={anonymous}
              />
              {errors.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="col-span-3"
                disabled={anonymous}
              />
              {errors.contact && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.contact}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telepon
              </Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
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
                    setAnonymous(checked === true)
                    if (checked) {
                      setContactInfo({ name: "", email: "", phone: "" })
                      setErrors({ name: "", contact: "" })
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
            <DialogDescription>Silakan isi formulir di bawah ini untuk menghubungi tim kami.</DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center my-4">
              <div className="flex justify-center mb-4 text-green-500">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pesan Terkirim!</h3>
              <p className="text-gray-600">
                Terima kasih telah menghubungi kami. Tim kami akan segera menghubungi Anda.
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
                    placeholder="Masukkan nomor telepon Anda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-company">Perusahaan</Label>
                  <Input
                    id="contact-company"
                    name="company"
                    value={formState.company}
                    onChange={handleFormChange}
                    placeholder="Masukkan nama perusahaan Anda"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-service">Layanan yang Diminati</Label>
                <Select value={formState.service} onValueChange={handleSelectChange}>
                  <SelectTrigger id="contact-service">
                    <SelectValue placeholder="Pilih layanan yang Anda minati" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Pengembangan Aplikasi Web</SelectItem>
                    <SelectItem value="mobile-development">Pengembangan Aplikasi Mobile</SelectItem>
                    <SelectItem value="digital-consulting">Konsultasi Digital</SelectItem>
                    <SelectItem value="data-analytics">Analisis Data & AI</SelectItem>
                    <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                    <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  required
                  placeholder="Masukkan pesan Anda"
                  rows={4}
                />
              </div>

              <DialogFooter>
<Link href="/contact" passHref>
  <Button variant="outline" as="a">
    <span className="flex items-center">
      Informasi Kontak Kami
    </span>
  </Button>
</Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
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
    </main>
  )
}

// Sample suggested questions
const suggestedQuestions = [
  "Apa saja layanan yang ditawarkan Astra Digital?",
  "Ceritakan tentang Digital Intelligence",
  "Apa itu Data Product?",
  "Bagaimana cara menghubungi tim Astra Digital?",
  "Apa keunggulan Astra Digital dibandingkan kompetitor?",
  "Siapa saja klien Astra Digital?",
]

// Add CheckCircle component for success message
const CheckCircle = ({ size = 24, ...props }) => (
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
)
