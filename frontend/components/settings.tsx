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

    // Chatbot settings
    const [chatbotPrompt, setChatbotPrompt] = useState(
        "Fetching settings..."
    )
    const [selectedModel, setSelectedModel] = useState("")
    const [maxTokens, setMaxTokens] = useState([0])
    const [temperature, setTemperature] = useState([0])
    const [topK, setTopK] = useState([0])
    const [lastFileSync, setLastFileSync] = useState("File might be out of sync, please save settings to sync the file with the server.")

    
    function formatTimestamp(timestamp: any) {
    const date = new Date(timestamp * 1000); // Multiply by 1000 because JS uses milliseconds

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0"); // Ensure two-digit hours
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two-digit minutes
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Ensure two-digit seconds

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    }


    // Recommended default values based on common practices and initial code's fallback
    const RECOMMENDED_DEFAULTS = {
        prompt_template: `# CANDY Chatbot Instructions
## Role and Task
**Your Name:** CANDY
**Description:** CANDY is a chatbot designed to provide information about Astra Digital, its services, and its expertise. CANDY should be helpful, informative, and professional in its responses.

## Knowledge Domain
* Astra Digital: CANDY should have a comprehensive understanding of Astra Digital, including its history, mission, values, services, solutions, industries served, key clients, and digital transformation initiatives.
* Digital Technology: CANDY should be knowledgeable about digital technology trends, applications, innovations, and their impact on businesses.
* Digital Transformation: CANDY should understand digital transformation initiatives and Astra Digital's approach to digital transformation.
* General Knowledge: CANDY should have a general understanding of technology and business concepts, but it should not provide specific technical support or troubleshooting.

## Core Capabilities:

*   Answering questions about Astra Digital, its history, mission, and values. Providing details about Astra Digital's services and solutions. Listing industries served by Astra Digital and identifying key clients of Astra Digital  Describing the benefits of working with Astra Digital. Providing information about Astra Digital's digital transformation initiatives, and explaining Astra Digital's approach to digital transformation.
*   Answering question about digital technology trends, application, innovations, and its impact on businesses.
*   Politely declining to answer questions outside of its knowledge domain or expertise.
*   Politely declining to provide information about personal data, sensitive information, or confidential business information.
*   Escalating complex or out-of-scope inquiries to a "Hubungi Kami" (Contact Us) option.

## General Guidelines: 

*   **Greeting:** Always start with a polite greeting.
*   **Personalization:** Use the user's name if provided. Remember all user-provided details (e.g., name, company, needs, industry), actively reuse them across the conversation to personalize answers, and always refer back to the user's name and company where relevant
*   **Tone:** Maintain a professional and helpful tone.
*   **Language:** Use Bahasa Indonesia unless the question is explicitly in English, then respond in English.
*   **Advertising:** Always provide a positive and informative response about Astra Digital's services and solutions. Avoid using overly promotional language or making exaggerated claims. Always provide accurate and relevant information about Astra Digital's services and solutions.
*   **Out-of-Scope:** Politely decline to answer questions that are unrelated to Astra Digital, its services, or its expertise.
*   **"Hubungi Kami":** When appropriate, offer a "Hubungi Kami" (Contact Us) option to connect the user with a human representative for more personalized assistance. And include set link_to_contact to true.

## Answer Format:
### Response Format:
CANDY should respond in a structured format, including a message and a link_to_contact field. The message should contain the answer to the user's question, and the link_to_contact field should indicate whether you can't provide the answer, you don't know the answer, you don't have the data, or user should be directed to a human representative for further assistance.

### Examples:
**Example Input:** "Apa itu Astra Digital?"
**Example Output:**
{
    "message": "Astra Digital adalah anak perusahaan Astra International yang fokus pada transformasi digital dan inovasi teknologi.",
    "link_to_contact": false
}
**Example Input:** "Saya ingin tahu lebih banyak tentang layanan Astra Digital, secara spesifiknya tentang biaya jasa dan harga produk yang ditawarkan."
**Example Output:**
{
    "message": "Maaf, saya tidak dapat memberikan informasi tentang biaya jasa dan harga produk. Untuk informasi lebih lanjut, silakan hubungi tim kami melalui halaman 'Hubungi Kami'.",
    "link_to_contact": true
}
        `,
        model: "gemini-2.5-flash-preview-04-17",
        max_token: 512,
        temperature: 0.3,
        top_k: 5,
    };


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
                    // If fetching fails, set to recommended defaults
                    console.error("Failed to fetch settings, applying recommended defaults.");
                    setChatbotPrompt(RECOMMENDED_DEFAULTS.prompt_template);
                    setSelectedModel(RECOMMENDED_DEFAULTS.model);
                    setMaxTokens([RECOMMENDED_DEFAULTS.max_token]);
                    setTemperature([RECOMMENDED_DEFAULTS.temperature]);
                    setTopK([RECOMMENDED_DEFAULTS.top_k]);


                    // throw new Error("Failed to fetch settings")
                } else {
                    const data = await response.json()
                    setChatbotPrompt(data.prompt_template)
                    setSelectedModel(data.model)
                    setMaxTokens([data.max_token])
                    setTemperature([data.temperature])
                    setTopK([data.top_k])
                    setLastFileSync(`Last sync: ${formatTimestamp(data.last_file_sync_time)}. Please save to synchronize the files`)
                }

            } catch (error) {
                console.error("Error fetching settings:", error)
                // Also apply recommended defaults if there's an error
                setChatbotPrompt(RECOMMENDED_DEFAULTS.prompt_template);
                setSelectedModel(RECOMMENDED_DEFAULTS.model);
                setMaxTokens([RECOMMENDED_DEFAULTS.max_token]);
                setTemperature([RECOMMENDED_DEFAULTS.temperature]);
                setTopK([RECOMMENDED_DEFAULTS.top_k]);
            }
        }

        fetchSettings()
    }
        , [BACKEND_URL, router])



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

    const handleResetToDefault = () => {
        setChatbotPrompt(RECOMMENDED_DEFAULTS.prompt_template);
        setSelectedModel(RECOMMENDED_DEFAULTS.model);
        setMaxTokens([RECOMMENDED_DEFAULTS.max_token]);
        setTemperature([RECOMMENDED_DEFAULTS.temperature]);
        setTopK([RECOMMENDED_DEFAULTS.top_k]);
        alert("Settings reset to recommended defaults!");
    };


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
                            <SelectItem value="gemini-2.5-flash-preview-04-17">Gemini 2.5 Flash Preview (Fast, Best Accuracy)</SelectItem>
                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (Fast, Cost-Efficient)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">Select the language model that powers your chatbot.</p>
                </div>

                {/* Max Token Setting */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="max-tokens">Max Tokens</Label>
                        <span className="text-sm text-gray-500">{maxTokens[0]}</span> {/* Access value from array */}
                    </div>
                    <Slider
                        id="max-tokens"
                        min={128}
                        max={1024}
                        step={64}
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
                        <span className="text-sm text-gray-500">{temperature[0]}</span> {/* Access value from array */}
                    </div>
                    <Slider
                        id="temperature"
                        min={0}
                        max={0.5}
                        step={0.05}
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
                        <span className="text-sm text-gray-500">{topK[0]}</span> {/* Access value from array */}
                    </div>
                    <Slider id="top-k" min={1} max={50} step={1} value={topK} onValueChange={setTopK} />
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
                            <p>
                                <span className="text-sm text-gray-500">{lastFileSync}</span>
                            </p>
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
                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={handleResetToDefault}>Reset to Default</Button>
                    <Button className="w-auto bg-blue-600 hover:bg-blue-700" onClick={handleUpdateSettings}>Save Settings</Button>
                </div>
            </CardContent>
        </Card>
    )
}