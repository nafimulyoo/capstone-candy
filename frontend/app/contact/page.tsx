"use client"

import type React from "react"

import FloatingChatbot from "@/components/floating-chatbot"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  MessageSquare,
  Candy,
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function ContactPage() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, service: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
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

  return (
    <>
    <Header />
    
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Kami siap membantu Anda dengan kebutuhan digital bisnis Anda.
          </p>
        </div>
      </section>

      {/* Ask CANDY Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Butuh Jawaban Cepat?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dapatkan jawaban instan untuk pertanyaan Anda dengan CANDY,
              asisten virtual Astra Digital.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <Candy className="mr-2 h-5 w-5" />
              <h3 className="font-semibold">Chat dengan CANDY</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                CANDY dapat membantu Anda dengan informasi tentang layanan,
                produk, dan solusi digital Astra Digital. Dapatkan jawaban
                instan untuk pertanyaan umum tanpa perlu menunggu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chatbot">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Candy className="mr-1 h-4 w-4" /> Tanya CANDY Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4 text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Alamat</h3>
                    <p className="text-gray-600">
                      PT Astra Digital Internasional
                      <br />
                      Altira Business Park D.01-02
                      <br />
                      Jakarta, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4 text-white">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@astradigital.id"
                        className="hover:text-blue-600"
                      >
                        info@astradigital.id
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4 text-white">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Telepon</h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:+6281234567890"
                        className="hover:text-blue-600"
                      >
                        +62 812 3456 7890
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4">Jam Operasional</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Senin - Jumat: 09:00 - 17:00 WIB</p>
                  <p>Sabtu: 09:00 - 13:00 WIB</p>
                  <p>Minggu: Tutup</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nama Lengkap *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan alamat email Anda"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nomor Telepon
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="Masukkan nomor telepon Anda"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Perusahaan
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        placeholder="Masukkan nama perusahaan Anda"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Layanan yang Diminati
                    </label>
                    <Select
                      value={formState.service}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
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

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subjek *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan subjek pesan Anda"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pesan *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan pesan Anda"
                      rows={5}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
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
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lokasi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kunjungi kantor kami di Jakarta.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8444449420135!2d106.8836042104907!3d-6.1515819602715585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5e7a9692213%3A0x1229e3cb2859511c!2sPT%20Astra%20Digital%20Internasional-%20Altira%20Business%20Park%20D.01-02!5e0!3m2!1sen!2sid!4v1745996906918!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
      <FloatingChatbot />
    </main>
    </>
  )
}
