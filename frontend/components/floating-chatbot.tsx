"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, MessageSquare, X } from "lucide-react"

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">CANDY: Astra Digital Chatbot</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Punya pertanyaan? Chatbot kami siap membantu Anda dengan informasi tentang layanan dan solusi digital kami.
          </p>
          <Link href="/chatbot">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Candy className="mr-2 h-4 w-4" /> Mulai Chat
            </Button>
          </Link>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
        >
          <Candy size={24} />
        </Button>
      )}
    </div>
  )
}
