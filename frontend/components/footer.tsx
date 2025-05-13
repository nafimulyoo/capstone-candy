"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Globe, Candy } from "lucide-react"
import {
  MessageSquare,
} from "lucide-react"

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in on component mount
  
  useEffect(() => {
    // In a real app, you would check a token in localStorage or cookies
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="https://static.wikia.nocookie.net/logopedia/images/2/2a/Astra_Digital.svg"
              alt="Astra Digital Logo"
              width={150}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-400 mb-4">
              Astra Digital (PT Astra Digital Internasional) adalah perusahaan layanan digital yang dirintis oleh Grup
              Astra. Kami ada untuk memberikan ide dan solusi dalam membangun visi, atau tujuan bisnis bagi para
              entrepreneur maupun perusahaan yang bergerak dalam era digital.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-200">
                <Linkedin size={20} />
              </a>
            </div>
            <div className="mt-8">
              <Link href="/login" className="text-gray-400 hover:text-blue-200">
                  Admin Login
              </Link>
              </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#services" className="text-gray-400 hover:text-blue-200">
                  Layanan Kami
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-gray-400 hover:text-blue-200">
                  Produk Kami
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-gray-400 hover:text-blue-200">
                  Portofolio Kami
                </Link>
              </li>
              <li>
                <span className="text-gray-400">Artikel</span>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-blue-200">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-200">
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Lainnya */}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Punya Pertanyaan?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Candy size={20} className="mr-2 text-gray-400 mt-1" />
                <span className="text-gray-400">
                  Tanya chatbot kami
                  <br />
                  <Link href="/chatbot"  className="text-gray-400 hover:text-blue-200">
                    CANDY
                  </Link>

                </span>
              </li>

              <li className="flex items-start">
                <Mail size={20} className="mr-2 text-gray-400 mt-1" />
                <span className="text-gray-400">
                  Hubungi kami di
                  <br />
                  <a href="mailto:info@astradigital.id" className="text-gray-400 hover:text-blue-200">
                    info@astradigital.id
                  </a>

                </span>
              </li>
              <li className="flex items-center">
                <Instagram size={20} className="mr-2 text-gray-400" />
                <a href="https://instagram.com/astradigitalid" className="text-gray-400 hover:text-blue-200">
                  @astradigitalid
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
