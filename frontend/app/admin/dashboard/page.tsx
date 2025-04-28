"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, Upload, Users, MessageSquare, Clock, Search, Filter } from "lucide-react"

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadSuccess(false)
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)
      setFile(null)

      // Reset form
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }, 2000)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Analisis dan manajemen chatbot Q&A Radiance</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversations">Percakapan</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Percakapan</CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-gray-500">+12% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">843</div>
                  <p className="text-xs text-gray-500">+5% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Durasi</CardTitle>
                  <Clock className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3:24</div>
                  <p className="text-xs text-gray-500">-8% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Kepuasan</CardTitle>
                  <PieChart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-gray-500">+3% dari bulan lalu</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Percakapan per Hari</CardTitle>
                  <CardDescription>Jumlah percakapan harian dalam 30 hari terakhir</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                    <LineChart className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Grafik Percakapan per Hari</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topik Populer</CardTitle>
                  <CardDescription>Topik yang paling sering ditanyakan</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                    <BarChart className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Grafik Topik Populer</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Percakapan</CardTitle>
                <CardDescription>Daftar percakapan terbaru dengan chatbot</CardDescription>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Cari percakapan..." className="pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-12 px-4 text-left font-medium">ID</th>
                          <th className="h-12 px-4 text-left font-medium">Pengguna</th>
                          <th className="h-12 px-4 text-left font-medium">Waktu</th>
                          <th className="h-12 px-4 text-left font-medium">Topik</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversations.map((conversation) => (
                          <tr key={conversation.id} className="border-b">
                            <td className="p-4 align-middle">{conversation.id}</td>
                            <td className="p-4 align-middle">{conversation.user}</td>
                            <td className="p-4 align-middle">{conversation.time}</td>
                            <td className="p-4 align-middle">{conversation.topic}</td>
                            <td className="p-4 align-middle">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  conversation.status === "Selesai"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {conversation.status}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="ghost" size="sm">
                                Lihat
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">Menampilkan 1-10 dari 248 percakapan</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Sebelumnya
                    </Button>
                    <Button variant="outline" size="sm">
                      Berikutnya
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analitik Chatbot</CardTitle>
                <CardDescription>Metrik dan statistik performa chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Distribusi Topik</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                        <PieChart className="h-8 w-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Grafik Distribusi Topik</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Waktu Respons</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                        <LineChart className="h-8 w-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Grafik Waktu Respons</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Tingkat Resolusi</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                        <BarChart className="h-8 w-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Grafik Tingkat Resolusi</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Penggunaan per Jam</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                        <BarChart className="h-8 w-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Grafik Penggunaan per Jam</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Data Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data Chatbot</CardTitle>
                <CardDescription>Upload data untuk meningkatkan kemampuan chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upload File</h3>
                    <p className="text-gray-500 mb-4">Seret dan lepas file di sini, atau klik untuk memilih file</p>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Pilih File
                    </Button>
                    {file && (
                      <div className="mt-4 text-left bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium">File yang dipilih:</p>
                        <p className="text-sm text-gray-500">
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <h3 className="text-sm font-medium">Format yang Didukung:</h3>
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                      <li>CSV (Comma Separated Values)</li>
                      <li>JSON (JavaScript Object Notation)</li>
                      <li>TXT (Plain Text)</li>
                      <li>PDF (Portable Document Format)</li>
                    </ul>
                  </div>

                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!file || isUploading}>
                    {isUploading ? (
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
                        Mengupload...
                      </span>
                    ) : (
                      <span>Upload Data</span>
                    )}
                  </Button>

                  {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            File berhasil diupload! Data akan segera diproses dan ditambahkan ke basis pengetahuan
                            chatbot.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Sample data for conversations
const conversations = [
  {
    id: "CONV-1248",
    user: "budi@example.com",
    time: "2023-05-15 14:32",
    topic: "Pengembangan Web",
    status: "Selesai",
  },
  {
    id: "CONV-1247",
    user: "siti@example.com",
    time: "2023-05-15 13:45",
    topic: "Harga Layanan",
    status: "Selesai",
  },
  {
    id: "CONV-1246",
    user: "ahmad@example.com",
    time: "2023-05-15 11:20",
    topic: "Aplikasi Mobile",
    status: "Selesai",
  },
  {
    id: "CONV-1245",
    user: "dewi@example.com",
    time: "2023-05-15 10:05",
    topic: "Konsultasi Digital",
    status: "Berlangsung",
  },
  {
    id: "CONV-1244",
    user: "hendra@example.com",
    time: "2023-05-14 16:48",
    topic: "UI/UX Design",
    status: "Selesai",
  },
  {
    id: "CONV-1243",
    user: "rina@example.com",
    time: "2023-05-14 15:30",
    topic: "Digital Marketing",
    status: "Selesai",
  },
  {
    id: "CONV-1242",
    user: "joko@example.com",
    time: "2023-05-14 14:15",
    topic: "Analisis Data",
    status: "Berlangsung",
  },
  {
    id: "CONV-1241",
    user: "maya@example.com",
    time: "2023-05-14 11:22",
    topic: "Pengembangan Web",
    status: "Selesai",
  },
  {
    id: "CONV-1240",
    user: "dian@example.com",
    time: "2023-05-14 10:10",
    topic: "Harga Layanan",
    status: "Selesai",
  },
  {
    id: "CONV-1239",
    user: "rudi@example.com",
    time: "2023-05-13 16:55",
    topic: "Aplikasi Mobile",
    status: "Selesai",
  },
]
