"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  
  useEffect(() => {
    // In a real app, you would check a token in localStorage or cookies
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigateToSection = (sectionId: string) => {
    // Check if we're already on the homepage
    if (window.location.pathname === "/") {
      // If on homepage, just scroll to the section
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If on another page, navigate to homepage with hash
      router.push(`/#${sectionId}`)
    }

    // Close mobile menu if open
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://static.wikia.nocookie.net/logopedia/images/2/2a/Astra_Digital.svg"
              alt="Astra Digital Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigateToSection("services")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Layanan Kami
            </button>
            <button
              onClick={() => navigateToSection("portfolio")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Portofolio Kami
            </button>
            <button
              onClick={() => navigateToSection("products")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Produk Kami
            </button>
            <button
              onClick={() => navigateToSection("about")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Tentang Kami
            </button>
            <Link href="/chatbot" className="text-gray-700 hover:text-blue-600 font-medium">
              Chatbot
            </Link>
          </nav>

          {/* CTA and Login/Dashboard Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/contact">
              <Button className="bg-blue-800 hover:bg-blue-900">Hubungi Kami</Button>
            </Link>

            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
            ) : (
            <>
            </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">

            <button
              onClick={() => navigateToSection("services")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
            >
              Layanan Kami
            </button>
            <button
              onClick={() => navigateToSection("portfolio")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
            >
              Portofolio Kami
            </button>
            <button
              onClick={() => navigateToSection("products")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
            >
              Produk Kami
            </button>
                        <button
              onClick={() => navigateToSection("about")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
            >
              Tentang Kami
            </button>
            <Link
              href="/chatbot"
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMenu}
            >
              Chatbot
            </Link>
            <Link href="/contact" onClick={toggleMenu}>
              <Button className="w-full bg-blue-800 hover:bg-blue-900">Hubungi Kami</Button>
            </Link>

            {isLoggedIn ? (
              <Link href="/dashboard" onClick={toggleMenu}>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
            ) : (
                <>
                </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
