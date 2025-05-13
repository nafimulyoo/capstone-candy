"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogOut,
} from "lucide-react"


import Header from "@/components/header"
import Analytics from "@/components/analytics"
import Settings from "@/components/settings"
import History from "@/components/history"

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiredTime");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }

    const expiredTime = localStorage.getItem("expiredTime");
    if (expiredTime) {
      const expiredDate = new Date(expiredTime);
      if (expiredDate < new Date()) {
        localStorage.removeItem("token");
        localStorage.removeItem("expiredTime");
        router.push("/login");
      }
    }

  }, [router]);


  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">CANDY Dashboard</h1>
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => {
                handleLogout()
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
              <Analytics />
            </TabsContent>
            <TabsContent value="chat-history" className="space-y-6">
              <History />
            </TabsContent>
            <TabsContent value="chatbot-settings" className="space-y-6">
              <Settings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
