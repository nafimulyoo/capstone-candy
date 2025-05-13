"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Users,
  Code,
  BarChart3,
  Database,
  Briefcase,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Candy,
  Crosshair,
  FastForward,
  Cpu

} from "lucide-react"
import { Input } from "@/components/ui/input"
import FloatingChatbot from "@/components/floating-chatbot"
import Header from "@/components/header"

export default function Home() {
  // Handle hash navigation when the page loads
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Get the element with the ID matching the hash (without the #)
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)

      // If the element exists, scroll to it
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [])

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Solusi Digital Terpercaya untuk Bisnis Anda</h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">
                Astra Digital membantu perusahaan Anda bertransformasi melalui solusi digital inovatif yang meningkatkan
                efisiensi dan pertumbuhan bisnis.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="https://adiwebstprdsea.blob.core.windows.net/astradigital-be/assets/images/medium_Data_Intelligence_27afac2ec2.png"
                alt="Astra Digital Solutions"
                width={500}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        {/* About Us Section */}

        <section className="pt-32 bg-white" id="candy">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 relative ml-12">
            <div className="col-span-2">
              <div className="text-center flex flex-col justify-center items-center">

                <h2 className="text-4xl font-bold mb-4 mt-8 flex"><Candy className="h-12 w-12 text-blue-600 mr-2 pb-2" />Berkenalan dengan CANDY</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                  CANDY adalah asisten virtual yang dirancang untuk memberikan
                  informasi cepat dan akurat tentang layanan Astra Digital. CANDY hadir
                  untuk membantu Anda memahami bagaimana Astra Digital dapat mendukung
                  transformasi digital bisnis Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center text-center justify-center">
                  <Link href="/chatbot">
                    <Button size="lg" className="bg-blue-800 hover:bg-blue-900 mt-8">
                      Konsultasi Gratis Bersama CANDY
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-12">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xl font-semibold mb-2 flex items-center"><FastForward className="text-blue-800 mr-2" size={28} /> Respon Cepat</div>
                  <p className="text-gray-600">
                    CANDY memberikan respon instan untuk memberikan jawaban cepat.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xl font-semibold mb-2 flex items-center"><Cpu className="text-blue-800 mr-2" size={28} />Teknologi Terkini</div>
                  <p className="text-gray-600">
                    CANDY dibangun dengan teknologi LLM terkini untuk memberikan jawaban
                    yang cerdas dan komprehensif.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xl font-semibold mb-2 flex items-center"><Crosshair className="text-blue-800 mr-2" size={28} />Informasi Akurat</div>
                  <p className="text-gray-600">
                    CANDY terus diperbarui dengan informasi terbaru untuk memastikan Anda
                    mendapatkan jawaban yang paling akurat.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative bottom-0 col-span-1">
              <Image
                src="candy.png"
                alt="output"
                // border="0"
                width={500}
                height={500}
                className="absolute bottom-0"
              />
            </div>
          </div>
        </section>


        {/* Services Section */}
        <section className="py-16 bg-gray-50" id="services">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kami siap berdiskusi dan mendukung Anda mewujudkan ide-ide bisnis yang inovatif. Dengan pengalaman dan
                sumber daya kami, Astra Digital siap menjadi mitra yang dapat diandalkan dalam mengembangkan bisnis Anda
                di era digital.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 text-blue-600">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="text-blue-800 font-medium flex items-center hover:text-blue-800">
                    Lihat Detail <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-16 bg-white" id="portfolio">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Portofolio Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Lihat beberapa proyek sukses yang telah kami kerjakan untuk klien dari berbagai industri.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-md bg-white p-4 flex items-center justify-center h-32"
                >
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=150"}
                    alt={item.title}
                    width={150}
                    height={80}
                    className="max-h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white font-medium text-center px-2">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-gray-50" id="products">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Produk Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Solusi digital siap pakai yang dirancang untuk memenuhi kebutuhan bisnis Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={product.image || "/placeholder.svg?height=200&width=400"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <button className="text-blue-800 font-medium flex items-center hover:text-blue-800">
                      Pelajari Lebih Lanjut <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white" id="about">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Astra Digital (PT Astra Digital Internasional) adalah perusahaan layanan digital yang dirintis oleh Grup
                Astra. Kami ada untuk memberikan ide dan solusi dalam membangun visi, atau tujuan bisnis bagi para
                entrepreneur maupun perusahaan yang bergerak dalam era digital.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-blue-600">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Respon Cepat</h3>
                <p className="text-gray-600">
                  CANDY memberikan respon instan untuk memberikan jawaban cepat.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-blue-600">
                  <Code size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Teknologi Terkini</h3>
                <p className="text-gray-600">
                  Kami selalu menggunakan teknologi terbaru untuk memberikan solusi yang inovatif dan efektif.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-blue-600">
                  <BarChart3 size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hasil Terukur</h3>
                <p className="text-gray-600">
                  Kami fokus pada hasil yang terukur dan memberikan nilai nyata bagi bisnis klien kami.
                </p>
              </div>
            </div>
            <div className="mt-10 bg-blue-50 p-8 rounded-lg">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-bold mb-4">Berkenalan Dengan Kami dan Para Pemimpin di Astra Digital</h3>
                  <p className="text-gray-600 mb-4">
                    Astra Digital (PT Astra Digital Internasional) adalah perusahaan layanan digital yang dirintis oleh
                    Grup Astra. Kami ada untuk memberikan ide dan solusi dalam membangun visi, atau tujuan bisnis bagi
                    para entrepreneur maupun perusahaan yang bergerak dalam era digital.
                  </p>
                  <Button className="bg-blue-800 hover:bg-blue-700">Lihat Detail</Button>
                </div>
                <div className="md:w-1/3">
                  <Image
                    src="https://astradigital.id/_next/static/media/aboutSectionImg.2066bc1d.webp"
                    alt="Astra Digital Leadership"
                    width={300}
                    height={250}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-white" id="testimonials">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Apa Kata Klien Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dengarkan pengalaman dari klien yang telah bekerja sama dengan Astra Digital.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg?height=60&width=60"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter for updates</h2>
              <p className="text-gray-200 max-w-2xl mx-auto">
                Stay updated with the latest news, insights, and offers from Astra Digital.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <Input
                    type="email"
                    placeholder="Tulis email kamu"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </div>
                <Button className="bg-white text-blue-900 hover:bg-gray-100">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
        <FloatingChatbot />
      </main>
    </>
  )
}

// Sample data for services
const services = [
  {
    title: "Digital Ventures",
    description:
      "Sejak tahun 2018, kami telah menyalurkan lebih dari USD 300 juta dalam bentuk pembiayaan kepada perusahaan rintisan teknologi di berbagai sektor, sebagai bagian dari agenda transformasi digital Grup.",
    slug: "digital-ventures",
    icon: <Briefcase size={32} />,
  },
  {
    title: "Venture Building",
    description:
      "Corporate Venture Building telah menjadi strategi penting bagi perusahaan, tidak hanya untuk mempertahankan pertumbuhan jangka panjang mereka namun juga untuk tetap relevan dengan pelanggan dan pemangku kepentingan lainnya.",
    slug: "venture-building",
    icon: <Lightbulb size={32} />,
  },
  {
    title: "Strategy & Consulting",
    description:
      "Kami bercita-cita untuk menjadi mitra perdebatan strategis Anda dalam perjalanan digitalisasi Anda. Kami akan membantu Anda membangun strategi digital komprehensif yang disesuaikan dengan tujuan bisnis Anda.",
    slug: "strategy-consulting",
    icon: <Users size={32} />,
  },
  {
    title: "Digital Marketing",
    description:
      "Kami adalah konsultan pemasaran digital yang berfokus pada merek, strategi, dan berbasis data dengan keunggulan kreatif yang memberi Anda digital menyeluruh proses untuk membantu Anda mencapai hasil yang berdampak.",
    slug: "digital-marketing",
    icon: <BarChart3 size={32} />,
  },
  {
    title: "Data Intelligence",
    description:
      "Kami memanfaatkan kekuatan data, ekosistem data yang beragam dan AI untuk mempercepat pertumbuhan bisnis.",
    slug: "data-intelligence",
    icon: <Database size={32} />,
  },
  {
    title: "Academy & Technology",
    description:
      "Untuk mengimbangi kebutuhan akan talenta digital yang terus meningkat, Astra melihat adanya kebutuhan untuk membekali tenaga kerjanya dengan kemampuan digital yang sangat dibutuhkan.",
    slug: "academy-technology",
    icon: <BookOpen size={32} />,
  },
]

// Sample data for portfolio
const portfolioItems = [
  {
    title: "Paxel",
    slug: "paxel",
    image: "paxel.png",
  },
  {
    title: "OLXmobbi",
    slug: "olxmobbi",
    image: "https://ruangoto.com/wp-content/uploads/2024/03/Logo-OLXmobbi.png",
  },
  {
    title: "Halodoc",
    slug: "halodoc",
    image: "https://vectorseek.com/wp-content/uploads/2023/09/Halodoc-Logo-Vector.svg-.png",
  },
  {
    title: "Sayurbox",
    slug: "sayurbox",
    image: "sayurbox.png",
  },
  {
    title: "Astra Otoparts",
    slug: "astra-otoparts",
    image: "https://th.bing.com/th/id/R.d704ca6fc8313296d1dc882ace1189fb?rik=4jEwpRNq5cjidg&pid=ImgRaw&r=0",
  },
  {
    title: "Digiroom",
    slug: "digiroom",
    image: "https://auto2000.co.id/_ui/responsive/theme-auto2000/images/Digiroom_Logo_200312-02.png",
  },
]

// Sample data for products
const products = [
  {
    name: "SPLASH",
    description: "SPLASH memadukan kemampuan analisis data yang komprehensif dengan antarmuka yang intuitif, memungkinkan bisnis memahami dinamika ekonomi, memantau tren industri, dan mengidentifikasi peluang pasar—semuanya dalam satu alat terintegrasi.",
    slug: "product-1",
    image: "/splash-logo.png",
  },
  {
    name: "Natacara",
    description: "Natacara adalah salah satu inovasi terbaru dari Astra Digital yang memiliki fokus di bidang event management. Natacara hadir ke publik untuk melayani berbagai kebutuhan event, baik offline, online, maupun hybrid.",
    slug: "natacara",
    image: "/natacara-logo.png",
  },
  {
    name: "Astranauts",
    description: "Astranauts adalah kompetisi inovasi digital dan konferensi teknologi berskala nasional yang terbuka untuk startup dan mahasiswa dari seluruh Indonesia.",
    slug: "product-3",
    image: "/astranauts-logo.png",
  },
]

// Sample data for testimonials
const testimonials = [
  {
    name: "Muhammad Zuhdi Hanif",
    position: "IT Director for IKEA & Group Digital Dairy Farm Group",
    company: "IKEA",
    quote:
      "Astra have very enthusiastic, engaging and supportive talent that are open to try new things and not afraid to fail. We hope and plan to expand our collaboration into other Dairy Farm's companies.",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQEFwmWIBB5rCA/profile-displayphoto-shrink_800_800/B56ZPz7kp6GsAg-/0/1734964301212?e=1751500800&v=beta&t=uE-jTp8UcIdXf_XDnCmjlz04Lai-iB30KehyrgyczI4",
  },
  {
    name: "Rana Sahira",
    position: "Division Head of IT & GA",
    company: "PT Toyota Astra Financial Services",
    quote:
      "TAF collaborates with Natacara from Astra Digital, providing uswith full support, form consultation and event operations to their lucky draw feature. Thank you Natacara.",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQGQzXxgi0MIMg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709281284942?e=1751500800&v=beta&t=YtPIKE_eyNv8H1X7e_VUw1udQTKW4cdDZV_iYPPZPSk",
  },
  {
    name: "Sheila Ikhwani",
    position: "Director in Charge Astra Financial",
    company: "SEVA",
    quote: "Really satisfied with how Astra Digital work on SEVA. Everything is managed beautifully with clear result.",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQE_cWEIR2jzPA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694664623112?e=1751500800&v=beta&t=8iAuA4UkutDLIr5F681P9_Rr8MM-8k2jHAFqb3cuEyc",
  },
]
