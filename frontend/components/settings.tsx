"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Upload,
    Folder,
    Trash2,
    FileText,
    FilePlus,
    File,

} from "lucide-react"
import { Input } from "@/components/ui/input"
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

import { format, parseISO } from "date-fns"


import { knowledgeBaseFiles } from "@/data/dummy"
import Link from "next/link"


export default function Settings() {
    const router = useRouter()

    const [uploadedFiles, setUploadedFiles] = useState(knowledgeBaseFiles)
    const [isUploading, setIsUploading] = useState(false)

    const [maxTokens, setMaxTokens] = useState([0])

    // Chatbot settings
    const [chatbotPrompt, setChatbotPrompt] = useState(
        "Anda adalah asisten AI Astra Digital bernama CANDY yang membantu pengguna dengan informasi tentang layanan dan produk Astra Digital. Anda harus selalu ramah, informatif, dan profesional.",
    )
    const [selectedModel, setSelectedModel] = useState("")
    const [temperature, setTemperature] = useState([0])
    const [topK, setTopK] = useState([0])


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    // fetch initial settings from backend
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/llm-settings`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch settings")
                }

                const data = await response.json()
                setChatbotPrompt(data.prompt_template)
                setSelectedModel(data.model)
                setMaxTokens([data.max_token])
                setTemperature([data.temperature])
                setTopK([data.top_k])
            } catch (error) {
                console.error("Error fetching settings:", error)
            }
        }

        fetchSettings()
    }
        , [])



    const handleUpdateSettings = () => {
        // Here you would typically send the updated settings to your backend

        const settings = {
            prompt_template: chatbotPrompt,
            model: selectedModel,
            max_token: maxTokens[0],
            temperature: temperature[0],
            top_k: topK[0],
        }

        const updateSettings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/llm-settings`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(settings),
                })

                if (!response.ok) {
                    throw new Error("Failed to update settings")
                }

                const data = await response.json()
                console.log("Settings updated successfully:", data)
            } catch (error) {
                console.error("Error updating settings:", error)
            }
        }

        updateSettings()

        console.log("Updated Settings:", settings)
        alert("Settings updated successfully!")
    }



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

    return (
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
                            <Link href="https://drive.google.com/drive/folders/1tAasvudukCy0P1frrz-v7UZIKAe7TSIJ?usp=sharing">
                                <Button variant="outline" size="sm">
                                    <Folder className="h-4 w-4 mr-2" /> Edit Files
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <iframe src="https://drive.google.com/embeddedfolderview?id=1tAasvudukCy0P1frrz-v7UZIKAe7TSIJ#list"
                                style={{ width: "100%", height: "360px", border: 0 }}></iframe>
                            {/* {uploadedFiles.length === 0 ? (
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
                            )} */}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Upload files to provide context for your chatbot's responses.</p>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleUpdateSettings}>Save Settings</Button>
            </CardContent>
        </Card>
    )
}