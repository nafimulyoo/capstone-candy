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

// Dummy data for user activity chart
const userActivityData = [
  { date: "2025-04-01 00:00:00", users: 120 },
  { date: "2025-04-02 00:00:00", users: 132 },
  { date: "2025-04-03 00:00:00", users: 145 },
  { date: "2025-04-04 00:00:00", users: 140 },
  { date: "2025-04-05 00:00:00", users: 158 },
  { date: "2025-04-06 00:00:00", users: 172 },
  { date: "2025-04-07 00:00:00", users: 190 },
  { date: "2025-04-08 00:00:00", users: 185 },
  { date: "2025-04-09 00:00:00", users: 192 },
  { date: "2025-04-10 00:00:00", users: 210 },
  { date: "2025-04-11 00:00:00", users: 215 },
  { date: "2025-04-12 00:00:00", users: 234 },
  { date: "2025-04-13 00:00:00", users: 256 },
  { date: "2025-04-14 00:00:00", users: 275 },
  { date: "2025-04-15 00:00:00", users: 294 },
  { date: "2025-04-16 00:00:00", users: 312 },
  { date: "2025-04-17 00:00:00", users: 308 },
  { date: "2025-04-18 00:00:00", users: 326 },
  { date: "2025-04-19 00:00:00", users: 340 },
  { date: "2025-04-20 00:00:00", users: 358 },
  { date: "2025-04-21 00:00:00", users: 374 },
  { date: "2025-04-22 00:00:00", users: 390 },
  { date: "2025-04-23 00:00:00", users: 410 },
  { date: "2025-04-24 00:00:00", users: 428 },
  { date: "2025-04-25 00:00:00", users: 445 },
  { date: "2025-04-26 00:00:00", users: 476 },
  { date: "2025-04-27 00:00:00", users: 490 },
  { date: "2025-04-28 00:00:00", users: 520 },
  { date: "2025-04-29 00:00:00", users: 545 },
  { date: "2025-04-30 00:00:00", users: 578 },
]

const responseTimeData = [
  { date: "2025-04-01 00:00:00", time: 1 },
  { date: "2025-04-02 00:00:00", time: 2 },
  { date: "2025-04-03 00:00:00", time: 5 },
  { date: "2025-04-04 00:00:00", time: 1 },
  { date: "2025-04-05 00:00:00", time: 8 },
  { date: "2025-04-06 00:00:00", time: 2 },
  { date: "2025-04-07 00:00:00", time: 1 },
  { date: "2025-04-08 00:00:00", time: 5 },
  { date: "2025-04-09 00:00:00", time: 2 },
  { date: "2025-04-10 00:00:00", time: 1 },
  { date: "2025-04-11 00:00:00", time: 5 },
  { date: "2025-04-12 00:00:00", time: 4 },
  { date: "2025-04-13 00:00:00", time: 2 },
  { date: "2025-04-14 00:00:00", time: 2 },
  { date: "2025-04-15 00:00:00", time: 4 },
  { date: "2025-04-16 00:00:00", time: 2 },
  { date: "2025-04-17 00:00:00", time: 8 },
  { date: "2025-04-18 00:00:00", time: 6 },
  { date: "2025-04-19 00:00:00", time: 1 },
  { date: "2025-04-20 00:00:00", time: 1 },
  { date: "2025-04-21 00:00:00", time: 4 },
  { date: "2025-04-22 00:00:00", time: 1 },
  { date: "2025-04-23 00:00:00", time: 1 },
  { date: "2025-04-24 00:00:00", time: 8 },
  { date: "2025-04-25 00:00:00", time: 5 },
  { date: "2025-04-26 00:00:00", time: 6 },
  { date: "2025-04-27 00:00:00", time: 1 },
  { date: "2025-04-28 00:00:00", time: 1 },
  { date: "2025-04-29 00:00:00", time: 5 },
  { date: "2025-04-30 00:00:00", time: 8 },
]

// Dummy data for satisfaction
const satisfactionData = [
  { date: "2025-04-01 00:00:00", satisfaction: 81 },
  { date: "2025-04-02 00:00:00", satisfaction: 82 },
  { date: "2025-04-03 00:00:00", satisfaction: 85 },
  { date: "2025-04-04 00:00:00", satisfaction: 81 },
  { date: "2025-04-05 00:00:00", satisfaction: 88 },
  { date: "2025-04-06 00:00:00", satisfaction: 82 },
  { date: "2025-04-07 00:00:00", satisfaction: 81 },
  { date: "2025-04-08 00:00:00", satisfaction: 85 },
  { date: "2025-04-09 00:00:00", satisfaction: 82 },
  { date: "2025-04-10 00:00:00", satisfaction: 81 },
  { date: "2025-04-11 00:00:00", satisfaction: 85 },
  { date: "2025-04-12 00:00:00", satisfaction: 84 },
  { date: "2025-04-13 00:00:00", satisfaction: 85 },
  { date: "2025-04-15 00:00:00", satisfaction: 84 },
  { date: "2025-04-16 00:00:00", satisfaction: 82 },
  { date: "2025-04-17 00:00:00", satisfaction: 88 },
  { date: "2025-04-18 00:00:00", satisfaction: 86 },
  { date: "2025-04-19 00:00:00", satisfaction: 81 },
  { date: "2025-04-20 00:00:00", satisfaction: 81 },
  { date: "2025-04-21 00:00:00", satisfaction: 84 },
  { date: "2025-04-22 00:00:00", satisfaction: 81 },
  { date: "2025-04-23 00:00:00", satisfaction: 81 },
  { date: "2025-04-24 00:00:00", satisfaction: 88 },
  { date: "2025-04-25 00:00:00", satisfaction: 85 },
  { date: "2025-04-26 00:00:00", satisfaction: 86 },
  { date: "2025-04-27 00:00:00", satisfaction: 81 },
  { date: "2025-04-28 00:00:00", satisfaction: 81 },
  { date: "2025-04-29 00:00:00", satisfaction: 85 },
  { date: "2025-04-30 00:00:00", satisfaction: 88 },
]

// Dummy data for call to action clicks
const ctaClicksData = [
  { date: "2025-04-01 00:00:00", clicks: 45 },
  { date: "2025-04-02 00:00:00", clicks: 52 },
  { date: "2025-04-03 00:00:00", clicks: 48 },
  { date: "2025-04-04 00:00:00", clicks: 55 },
  { date: "2025-04-05 00:00:00", clicks: 62 },
  { date: "2025-04-06 00:00:00", clicks: 58 },
  { date: "2025-04-07 00:00:00", clicks: 65 },
  { date: "2025-04-08 00:00:00", clicks: 72 },
  { date: "2025-04-09 00:00:00", clicks: 68 },
  { date: "2025-04-10 00:00:00", clicks: 75 },
  { date: "2025-04-11 00:00:00", clicks: 82 },
  { date: "2025-04-12 00:00:00", clicks: 78 },
  { date: "2025-04-13 00:00:00", clicks: 85 },
  { date: "2025-04-14 00:00:00", clicks: 92 },
  { date: "2025-04-15 00:00:00", clicks: 88 },
  { date: "2025-04-16 00:00:00", clicks: 95 },
  { date: "2025-04-17 00:00:00", clicks: 102 },
  { date: "2025-04-18 00:00:00", clicks: 98 },
  { date: "2025-04-19 00:00:00", clicks: 105 },
  { date: "2025-04-20 00:00:00", clicks: 112 },
  { date: "2025-04-21 00:00:00", clicks: 108 },
  { date: "2025-04-22 00:00:00", clicks: 115 },
  { date: "2025-04-23 00:00:00", clicks: 122 },
  { date: "2025-04-24 00:00:00", clicks: 118 },
  { date: "2025-04-25 00:00:00", clicks: 125 },
  { date: "2025-04-26 00:00:00", clicks: 132 },
  { date: "2025-04-27 00:00:00", clicks: 128 },
  { date: "2025-04-28 00:00:00", clicks: 135 },
  { date: "2025-04-29 00:00:00", clicks: 142 },
  { date: "2025-04-30 00:00:00", clicks: 138 },
]

// Dummy data for word cloud
const wordCloudData = [
  { value: "Digital Ventures", count: 45 },
  { value: "Venture Building", count: 38 },
  { value: "Strategy", count: 32 },
  { value: "Consulting", count: 30 },
  { value: "Digital Marketing", count: 28 },
  { value: "Data Intelligence", count: 25 },
  { value: "Academy", count: 22 },
  { value: "Technology", count: 20 },
  { value: "Transformation", count: 18 },
  { value: "Innovation", count: 16 },
  { value: "Startup", count: 15 },
  { value: "Investment", count: 14 },
  { value: "Fintech", count: 13 },
  { value: "E-commerce", count: 12 },
  { value: "Blockchain", count: 11 },
  { value: "AI", count: 10 },
  { value: "Machine Learning", count: 9 },
  { value: "Big Data", count: 8 },
  { value: "Cloud", count: 7 },
  { value: "IoT", count: 6 },
  { value: "Mobile", count: 5 },
  { value: "Web", count: 4 },
  { value: "UX/UI", count: 3 },
  { value: "Design", count: 2 },
  { value: "Development", count: 1 },
]

// Dummy data for chat history with conversation
const chatHistoryData = [
  {
    id: "CHAT-1001",
    user: "Anonymous User",
    time: "2025-04-29 10:23:00",
    topic: "Layanan Digital",
    satisfaction: 82,
    contact: "",
    conversation: [
      {
        sender: "user",
        content: "Halo, saya ingin tahu tentang layanan yang ditawarkan Astra Digital.",
        time: "10:23 AM",
      },
      {
        sender: "bot",
        content:
          "Halo! Senang bisa membantu Anda. Astra Digital menawarkan berbagai layanan digital, termasuk Digital Ventures, Venture Building, Strategy & Consulting, Digital Marketing, Data Intelligence, dan Academy & Technology. Layanan mana yang ingin Anda ketahui lebih lanjut?",
        time: "10:23 AM",
      },
      {
        sender: "user",
        content: "Saya tertarik dengan Digital Ventures. Bisa dijelaskan lebih detail?",
        time: "10:24 AM",
      },
      {
        sender: "bot",
        content:
          "Tentu! Digital Ventures adalah layanan investasi kami. Sejak tahun 2018, kami telah menyalurkan lebih dari USD 300 juta dalam bentuk pembiayaan kepada perusahaan rintisan teknologi di berbagai sektor, sebagai bagian dari agenda transformasi digital Grup Astra. Kami fokus pada investasi di perusahaan teknologi yang memiliki potensi pertumbuhan tinggi.",
        time: "10:24 AM",
      },
      {
        sender: "user",
        content: "Apakah ada contoh perusahaan yang telah mendapatkan investasi dari Astra Digital?",
        time: "10:25 AM",
      },
      {
        sender: "bot",
        content:
          "Ya, beberapa perusahaan yang telah mendapatkan investasi dari kami termasuk Paxel (logistik), OLXmobbi (otomotif), Halodoc (kesehatan), dan Sayurbox (e-commerce pertanian). Kami selalu mencari perusahaan inovatif yang dapat memberikan dampak positif bagi masyarakat Indonesia.",
        time: "10:25 AM",
      },
    ],
  },
  {
    id: "CHAT-1002",
    user: "Siti Rahayu",
    time: "2025-04-30 09:15:00",
    topic: "Digital Ventures",
    contact: "siti.rahayu@example.com | 081234567890",
    satisfaction: 80,
    conversation: [
      {
        sender: "user",
        content: "Selamat pagi, saya ingin tahu lebih banyak tentang Digital Ventures.",
        time: "09:15 AM",
      },
      {
        sender: "bot",
        content:
          "Selamat pagi, Siti! Digital Ventures adalah layanan investasi kami. Sejak tahun 2018, kami telah menyalurkan lebih dari USD 300 juta dalam bentuk pembiayaan kepada perusahaan rintisan teknologi di berbagai sektor, sebagai bagian dari agenda transformasi digital Grup Astra. Ada yang ingin Anda ketahui lebih spesifik?",
        time: "09:15 AM",
      },
      {
        sender: "user",
        content: "Bagaimana proses untuk mendapatkan investasi dari Astra Digital?",
        time: "09:16 AM",
      },
      {
        sender: "bot",
        content:
          "Proses untuk mendapatkan investasi dari Astra Digital dimulai dengan pengajuan proposal bisnis yang mencakup model bisnis, tim, traksi, dan proyeksi keuangan. Setelah itu, tim kami akan melakukan evaluasi awal, due diligence, dan jika sesuai, kami akan menawarkan term sheet. Anda dapat mengirimkan proposal ke ventures@astradigital.id untuk memulai proses.",
        time: "09:16 AM",
      },
    ],
  },
  {
    id: "CHAT-1003",
    user: "Anonymous User",
    time: "2025-04-29 16:45:00",
    topic: "Kontak",
    contact: "",
    satisfaction: 100,
    conversation: [
      {
        sender: "user",
        content: "Bagaimana cara menghubungi tim Astra Digital?",
        time: "4:45 PM",
      },
      {
        sender: "bot",
        content:
          "Anda dapat menghubungi kami melalui email di hello@astradigital.id atau mengunjungi halaman Kontak kami untuk informasi lebih lanjut. Kami juga memiliki kantor di Jakarta yang dapat Anda kunjungi dengan perjanjian terlebih dahulu.",
        time: "4:45 PM",
      },
      {
        sender: "user",
        content: "Apakah ada nomor telepon yang bisa dihubungi?",
        time: "4:46 PM",
      },
      {
        sender: "bot",
        content:
          "Ya, Anda dapat menghubungi kami di +62 21 5795 8822 selama jam kerja (Senin-Jumat, 09:00-17:00 WIB). Namun, untuk respons yang lebih cepat, kami sarankan untuk menghubungi kami melalui email.",
        time: "4:46 PM",
      },
    ],
  },
  {
    id: "CHAT-1004",
    user: "Anonymous User",
    time: "2025-04-29 14:30:00",
    topic: "Venture Building",
    contact: "",
    satisfaction: 100,
    conversation: [
      {
        sender: "user",
        content: "Apa itu Venture Building?",
        time: "2:30 PM",
      },
      {
        sender: "bot",
        content:
          "Corporate Venture Building telah menjadi strategi penting bagi perusahaan, tidak hanya untuk mempertahankan pertumbuhan jangka panjang mereka namun juga untuk tetap relevan dengan pelanggan dan pemangku kepentingan lainnya. Ini adalah proses di mana kami membantu perusahaan membangun bisnis baru dari awal, dengan menyediakan sumber daya, keahlian, dan jaringan yang diperlukan.",
        time: "2:31 PM",
      },
      {
        sender: "user",
        content: "Apa perbedaannya dengan Digital Ventures?",
        time: "2:32 PM",
      },
      {
        sender: "bot",
        content:
          "Perbedaan utama adalah Digital Ventures fokus pada investasi di perusahaan yang sudah ada, sementara Venture Building adalah tentang menciptakan bisnis baru dari awal. Dalam Venture Building, kami lebih terlibat dalam operasional dan pengembangan bisnis, sementara di Digital Ventures, kami lebih berperan sebagai investor.",
        time: "2:32 PM",
      },
    ],
  },
  {
    id: "CHAT-1005",
    user: "Rudi Hartono",
    time: "2025-04-29 11:20:00",
    topic: "Aplikasi Mobile",
    contact: "rudi.hartono@example.com",
    conversation: [
      {
        sender: "user",
        content: "Apakah Astra Digital menawarkan layanan pengembangan aplikasi mobile?",
        time: "11:20 AM",
      },
      {
        sender: "bot",
        content:
          "Ya, Astra Digital menawarkan layanan pengembangan aplikasi mobile sebagai bagian dari solusi teknologi kami. Tim kami berpengalaman dalam mengembangkan aplikasi untuk platform iOS dan Android dengan fokus pada pengalaman pengguna yang optimal dan performa tinggi.",
        time: "11:22 AM",
      },
      {
        sender: "user",
        content: "Berapa lama waktu yang dibutuhkan untuk mengembangkan aplikasi mobile?",
        time: "11:23 AM",
      },
      {
        sender: "bot",
        content:
          "Waktu pengembangan aplikasi mobile bervariasi tergantung pada kompleksitas dan fitur yang diinginkan. Secara umum, aplikasi sederhana dapat dikembangkan dalam 2-3 bulan, sementara aplikasi yang lebih kompleks dapat memakan waktu 4-6 bulan atau lebih. Kami selalu bekerja dengan timeline yang jelas dan komunikasi yang transparan dengan klien kami.",
        time: "11:24 AM",
      },
    ],
  },
  {
    id: "CHAT-1006",
    user: "Maya Wijaya",
    time: "2025-04-28 15:15:00",
    topic: "Biaya Layanan",
    contact: "0812-3456-7891",
    conversation: [
      {
        sender: "user",
        content: "Berapa biaya untuk layanan konsultasi digital?",
        time: "3:15 PM",
      },
      {
        sender: "bot",
        content:
          "Harga layanan kami bervariasi tergantung pada kebutuhan spesifik proyek Anda. Kami menawarkan konsultasi gratis untuk membahas proyek Anda dan memberikan estimasi biaya. Silakan hubungi tim kami untuk informasi lebih lanjut.",
        time: "3:17 PM",
      },
      {
        sender: "user",
        content: "Apakah ada paket layanan dengan harga tetap?",
        time: "3:18 PM",
      },
      {
        sender: "bot",
        content:
          "Ya, kami memiliki beberapa paket layanan dengan harga tetap untuk kebutuhan yang umum, seperti pengembangan website dasar, audit digital, dan kampanye pemasaran digital. Namun, untuk solusi yang lebih kustom, kami biasanya memberikan penawaran berdasarkan kebutuhan spesifik Anda setelah konsultasi awal.",
        time: "3:19 PM",
      },
    ],
  },
  {
    id: "CHAT-1007",
    user: "Dian Permata",
    time: "2025-04-27 10:05:00",
    topic: "Klien",
    contact: "dian.permata@example.com | 0812-3456-7892",
    satisfaction: 100,
    conversation: [
      {
        sender: "user",
        content: "Siapa saja klien Astra Digital?",
        time: "10:05 AM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital telah bekerja sama dengan berbagai perusahaan dari berbagai industri, termasuk IKEA, PT Toyota Astra Financial Services, dan banyak lagi. Kami juga telah berinvestasi di perusahaan seperti Paxel, OLXmobbi, Halodoc, dan Sayurbox.",
        time: "10:07 AM",
      },
      {
        sender: "user",
        content: "Apakah Astra Digital hanya bekerja dengan perusahaan besar?",
        time: "10:08 AM",
      },
      {
        sender: "bot",
        content:
          "Tidak, kami bekerja dengan perusahaan dari berbagai ukuran, mulai dari startup hingga perusahaan besar. Kami percaya bahwa transformasi digital penting untuk semua bisnis, dan kami menyesuaikan pendekatan kami untuk memenuhi kebutuhan dan anggaran klien kami.",
        time: "10:09 AM",
      },
    ],
  },
  {
    id: "CHAT-1008",
    user: "Hendra Gunawan",
    time: "2025-04-26 14:40:00",
    topic: "Keunggulan",
    contact: "hendra.gunawan@example.com",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Apa keunggulan Astra Digital dibandingkan kompetitor?",
        time: "2:40 PM",
      },
      {
        sender: "bot",
        content:
          "Keunggulan Astra Digital terletak pada pengalaman kami yang luas, tim ahli yang berdedikasi, dan pendekatan yang berfokus pada hasil terukur. Sebagai bagian dari Grup Astra, kami juga memiliki jaringan yang kuat dan pemahaman mendalam tentang berbagai industri di Indonesia.",
        time: "2:42 PM",
      },
      {
        sender: "user",
        content: "Bagaimana dengan teknologi yang digunakan?",
        time: "2:43 PM",
      },
      {
        sender: "bot",
        content:
          "Kami selalu menggunakan teknologi terkini dan terbaik untuk setiap proyek. Tim kami terus mengikuti perkembangan teknologi dan tren industri untuk memastikan solusi yang kami berikan adalah yang paling efektif dan efisien. Kami juga memiliki keahlian dalam berbagai teknologi, termasuk AI, blockchain, cloud computing, dan lainnya.",
        time: "2:44 PM",
      },
    ],
  },
  {
    id: "CHAT-1009",
    user: "Rina Fitriani",
    time: "2025-04-25 09:30:00",
    topic: "Program Magang",
    contact: "0812-3456-7893",
    satisfaction: 100,
    conversation: [
      {
        sender: "user",
        content: "Apakah Astra Digital menawarkan program magang?",
        time: "9:30 AM",
      },
      {
        sender: "bot",
        content:
          "Ya, Astra Digital memiliki program magang untuk mahasiswa dan lulusan baru di berbagai bidang seperti pengembangan software, desain UX/UI, data science, dan digital marketing. Silakan kirim CV Anda ke careers@astradigital.id untuk informasi lebih lanjut.",
        time: "9:33 AM",
      },
      {
        sender: "user",
        content: "Berapa lama program magang tersebut?",
        time: "9:34 AM",
      },
      {
        sender: "bot",
        content:
          "Program magang kami biasanya berlangsung selama 3-6 bulan, tergantung pada ketersediaan dan kebutuhan departemen. Kami menawarkan pengalaman praktis dan mentoring dari profesional berpengalaman untuk membantu Anda mengembangkan keterampilan dan mempersiapkan karir di industri digital.",
        time: "9:35 AM",
      },
    ],
  },
  {
    id: "CHAT-1010",
    user: "Joko Susilo",
    time: "2025-04-24 16:10:00",
    topic: "Proses Kerja Sama",
    contact: "joko.susilo@example.com | 0812-3456-7894",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Bagaimana proses kerja sama dengan Astra Digital?",
        time: "4:10 PM",
      },
      {
        sender: "bot",
        content:
          "Proses kerja sama dengan Astra Digital dimulai dengan konsultasi awal untuk memahami kebutuhan Anda, dilanjutkan dengan proposal solusi, persetujuan, implementasi, dan evaluasi. Kami menerapkan metodologi agile untuk memastikan fleksibilitas dan hasil yang optimal.",
        time: "4:13 PM",
      },
      {
        sender: "user",
        content: "Berapa lama biasanya proses dari konsultasi awal hingga implementasi?",
        time: "4:14 PM",
      },
      {
        sender: "bot",
        content:
          "Timeframe bervariasi tergantung pada kompleksitas proyek, tetapi secara umum, dari konsultasi awal hingga implementasi dapat memakan waktu 2-8 minggu. Kami selalu berusaha untuk bergerak cepat sambil memastikan kualitas dan hasil yang sesuai dengan harapan klien kami.",
        time: "4:15 PM",
      },
    ],
  },
  {
    id: "CHAT-1011",
    user: "Anita Wijaya",
    time: "2025-04-23 11:05:00",
    topic: "Data Intelligence",
    contact: "anita.wijaya@example.com",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Apa itu layanan Data Intelligence dari Astra Digital?",
        time: "11:05 AM",
      },
      {
        sender: "bot",
        content:
          "Data Intelligence adalah layanan kami yang memanfaatkan kekuatan data, ekosistem data yang beragam, dan AI untuk mempercepat pertumbuhan bisnis. Kami membantu perusahaan mengumpulkan, menganalisis, dan menggunakan data untuk membuat keputusan yang lebih baik dan meningkatkan operasional mereka.",
        time: "11:06 AM",
      },
    ],
  },
  {
    id: "CHAT-1012",
    user: "Bima Putra",
    time: "2025-04-22 14:15:00",
    topic: "Digital Marketing",
    contact: "0812-3456-7895",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Apa saja layanan Digital Marketing yang ditawarkan?",
        time: "2:15 PM",
      },
      {
        sender: "bot",
        content:
          "Layanan Digital Marketing kami mencakup strategi pemasaran digital, SEO, SEM, media sosial, content marketing, email marketing, dan analitik. Kami membantu perusahaan meningkatkan visibilitas online, menarik lebih banyak pelang  dan analitik. Kami membantu perusahaan meningkatkan visibilitas online, menarik lebih banyak pelanggan, dan meningkatkan konversi.",
        time: "2:16 PM",
      },
    ],
  },
  {
    id: "CHAT-1013",
    user: "Citra Dewi",
    time: "2025-04-21 10:30:00",
    topic: "Academy & Technology",
    contact: "citra.dewi@example.com | 0812-3456-7896",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Apa itu layanan Academy & Technology?",
        time: "10:30 AM",
      },
      {
        sender: "bot",
        content:
          "Academy & Technology adalah layanan kami yang fokus pada pengembangan talenta digital. Kami menawarkan pelatihan, workshop, dan program pengembangan untuk membekali karyawan dengan keterampilan digital yang dibutuhkan di era digital saat ini.",
        time: "10:31 AM",
      },
    ],
  },
  {
    id: "CHAT-1014",
    user: "Dodi Santoso",
    time: "2025-04-20 15:45:00",
    topic: "Strategy & Consulting",
    contact: "dodi.santoso@example.com",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Apa yang ditawarkan dalam layanan Strategy & Consulting?",
        time: "3:45 PM",
      },
      {
        sender: "bot",
        content:
          "Layanan Strategy & Consulting kami membantu perusahaan membangun strategi digital yang komprehensif dan selaras dengan tujuan bisnis mereka. Kami menawarkan konsultasi dalam transformasi digital, inovasi, dan optimasi proses bisnis.",
        time: "3:46 PM",
      },
    ],
  },
  {
    id: "CHAT-1015",
    user: "Eka Pratama",
    time: "2025-04-19 09:20:00",
    topic: "Teknologi Blockchain",
    contact: "0812-3456-7897",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Apakah Astra Digital memiliki keahlian dalam teknologi blockchain?",
        time: "9:20 AM",
      },
      {
        sender: "bot",
        content:
          "Ya, Astra Digital memiliki keahlian dalam teknologi blockchain. Kami telah mengembangkan beberapa solusi berbasis blockchain untuk klien kami, terutama dalam sektor finansial, supply chain, dan manajemen identitas.",
        time: "9:21 AM",
      },
    ],
  },
  {
    id: "CHAT-1016",
    user: "Faisal Rahman",
    time: "2025-04-18 13:10:00",
    topic: "Artificial Intelligence",
    contact: "faisal.rahman@example.com | 0812-3456-7898",
    satisfaction: 82,
    conversation: [
      {
        sender: "user",
        content: "Bagaimana Astra Digital mengimplementasikan AI dalam solusinya?",
        time: "1:10 PM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital mengimplementasikan AI dalam berbagai solusi, termasuk chatbot, analisis sentimen, prediksi perilaku pelanggan, optimasi proses, dan personalisasi pengalaman pengguna. Kami menggunakan berbagai teknik AI seperti machine learning, deep learning, dan natural language processing.",
        time: "1:11 PM",
      },
    ],
  },
  {
    id: "CHAT-1017",
    user: "Gita Purnama",
    time: "2025-04-17 11:25:00",
    topic: "E-commerce",
    contact: "gita.purnama@example.com",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Apakah Astra Digital membantu dalam pengembangan platform e-commerce?",
        time: "11:25 AM",
      },
      {
        sender: "bot",
        content:
          "Ya, Astra Digital memiliki pengalaman dalam pengembangan platform e-commerce. Kami membantu perusahaan membangun dan mengoptimalkan toko online mereka, termasuk integrasi pembayaran, manajemen inventaris, analitik, dan pengalaman pengguna.",
        time: "11:26 AM",
      },
    ],
  },
  {
    id: "CHAT-1018",
    user: "Hadi Wijaya",
    time: "2025-04-16 16:30:00",
    topic: "IoT",
    contact: "0812-3456-7899",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Apa pengalaman Astra Digital dalam IoT (Internet of Things)?",
        time: "4:30 PM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital memiliki pengalaman dalam mengembangkan solusi IoT untuk berbagai industri, termasuk manufaktur, logistik, dan smart city. Kami membantu perusahaan mengumpulkan dan menganalisis data dari perangkat IoT untuk meningkatkan efisiensi operasional dan membuat keputusan yang lebih baik.",
        time: "4:31 PM",
      },
    ],
  },
  {
    id: "CHAT-1019",
    user: "Indah Sari",
    time: "2025-04-15 10:45:00",
    topic: "UX/UI Design",
    contact: "indah.sari@example.com | 0812-3456-7900",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Apakah Astra Digital menawarkan layanan UX/UI Design?",
        time: "10:45 AM",
      },
      {
        sender: "bot",
        content:
          "Ya, Astra Digital menawarkan layanan UX/UI Design sebagai bagian dari solusi pengembangan digital kami. Tim desain kami berfokus pada menciptakan pengalaman pengguna yang intuitif, menarik, dan efektif untuk aplikasi web dan mobile.",
        time: "10:46 AM",
      },
    ],
  },
  {
    id: "CHAT-1020",
    user: "Joko Widodo",
    time: "2025-04-14 14:50:00",
    topic: "Cloud Computing",
    contact: "joko.widodo@example.com",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Apa layanan cloud computing yang ditawarkan Astra Digital?",
        time: "2:50 PM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital menawarkan layanan konsultasi dan implementasi cloud computing, termasuk migrasi ke cloud, optimasi infrastruktur cloud, dan pengembangan aplikasi cloud-native. Kami bekerja dengan berbagai platform cloud seperti AWS, Google Cloud, dan Microsoft Azure.",
        time: "2:51 PM",
      },
    ],
  },
  {
    id: "CHAT-1021",
    user: "Kartika Dewi",
    time: "2025-04-13 09:15:00",
    topic: "Cybersecurity",
    contact: "0812-3456-7901",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Bagaimana Astra Digital memastikan keamanan data dalam solusinya?",
        time: "9:15 AM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital menerapkan praktik keamanan terbaik dalam semua solusi kami, termasuk enkripsi data, autentikasi multi-faktor, pemantauan keamanan, dan audit keamanan reguler. Kami juga memiliki tim keamanan yang berdedikasi untuk memastikan perlindungan data klien kami.",
        time: "9:16 AM",
      },
    ],
  },
  {
    id: "CHAT-1022",
    user: "Lukman Hakim",
    time: "2025-04-12 15:20:00",
    topic: "Big Data",
    contact: "lukman.hakim@example.com | 0812-3456-7902",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Apa kemampuan Astra Digital dalam menangani Big Data?",
        time: "3:20 PM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital memiliki keahlian dalam menangani Big Data, termasuk pengumpulan, penyimpanan, pemrosesan, dan analisis data dalam jumlah besar. Kami menggunakan berbagai teknologi dan framework Big Data seperti Hadoop, Spark, dan teknologi data lake untuk membantu perusahaan mendapatkan insights dari data mereka.",
        time: "3:21 PM",
      },
    ],
  },
  {
    id: "CHAT-1023",
    user: "Mira Lestari",
    time: "2025-04-11 11:40:00",
    topic: "Digital Transformation",
    contact: "mira.lestari@example.com",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Bagaimana Astra Digital membantu perusahaan dalam transformasi digital?",
        time: "11:40 AM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital membantu perusahaan dalam transformasi digital melalui pendekatan komprehensif yang mencakup asesmen kematangan digital, perencanaan strategi, implementasi teknologi, dan manajemen perubahan. Kami bekerja sama dengan klien untuk mengidentifikasi peluang digital dan mengembangkan roadmap transformasi yang sesuai dengan tujuan bisnis mereka.",
        time: "11:41 AM",
      },
    ],
  },
  {
    id: "CHAT-1024",
    user: "Nadia Putri",
    time: "2025-04-10 13:35:00",
    topic: "Mobile App Development",
    contact: "0812-3456-7903",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Teknologi apa yang digunakan Astra Digital untuk pengembangan aplikasi mobile?",
        time: "1:35 PM",
      },
      {
        sender: "bot",
        content:
          "Astra Digital menggunakan berbagai teknologi untuk pengembangan aplikasi mobile, termasuk native development (Swift untuk iOS, Kotlin untuk Android) dan cross-platform frameworks seperti React Native dan Flutter. Pilihan teknologi tergantung pada kebutuhan spesifik proyek dan preferensi klien.",
        time: "1:36 PM",
      },
    ],
  },
  {
    id: "CHAT-1025",
    user: "Oscar Pratama",
    time: "2025-04-09 10:10:00",
    topic: "Web Development",
    contact: "oscar.pratama@example.com | 0812-3456-7904",
    satisfaction: 42,
    conversation: [
      {
        sender: "user",
        content: "Apa teknologi yang digunakan untuk pengembangan web?",
        time: "10:10 AM",
      },
      {
        sender: "bot",
        content:
          "Untuk pengembangan web, Astra Digital menggunakan berbagai teknologi modern seperti React, Angular, Vue.js untuk frontend, dan Node.js, Python, Java, atau .NET untuk backend. Kami juga menggunakan CMS seperti WordPress atau Drupal untuk proyek yang sesuai.",
        time: "10:11 AM",
      },
    ],
  },
]

// Dummy data for knowledge base files
const knowledgeBaseFiles = [
  {
    name: "Astra Digital Services Overview.pdf",
    type: "pdf",
    size: "2.4 MB",
    date: "2025-04-15 00:00:00",
  },
  {
    name: "Digital Ventures Case Studies.docx",
    type: "docx",
    size: "1.8 MB",
    date: "2025-03-22 00:00:00",
  },
  {
    name: "Venture Building Methodology.pdf",
    type: "pdf",
    size: "3.2 MB",
    date: "2025-02-10 00:00:00",
  },
  {
    name: "Frequently Asked Questions.txt",
    type: "txt",
    size: "156 KB",
    date: "2025-04-30 00:00:00",
  },
  {
    name: "Client Testimonials.pdf",
    type: "pdf",
    size: "1.1 MB",
    date: "2025-01-18 00:00:00",
  },
]

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

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

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
        return chatDate >= dateRange.from && chatDate <= dateRange.to
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
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CANDY Dashboard</h1>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => {
              localStorage.removeItem("isLoggedIn")
              router.push("/")
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
          from: date,
          to: prev?.to || date
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
                from: prev?.from || date,
                to: date
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
                              from: date,
                              to: prev?.to || date
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
                              from: prev?.from || date,
                              to: date
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
  )
}
