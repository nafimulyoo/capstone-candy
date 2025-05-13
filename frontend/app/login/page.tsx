"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import Header from "@/components/header";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const email = formData.email;
    const password = formData.password;

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // set expired time
        localStorage.setItem("token", data.token);
        const expiredTime = new Date();
        expiredTime.setMinutes(expiredTime.getMinutes() + 45);
        localStorage.setItem("expiredTime", expiredTime.toString());
        // localStorage.setItem("admin", JSON.stringify(data.admin));
        router.push("/dashboard");
      } else {
        let errorMessage = "Login failed.";
        if (data.detail && data.detail.error && data.detail.error.message) {
          errorMessage = data.detail.error.message;
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      setError("Network error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    
    <Header/>
    <main className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-gray-600 mt-2">Masuk ke akun Astra Digital Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Lupa password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
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
                    Masuk...
                  </span>
                ) : (
                  <span>Masuk</span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Untuk demo, gunakan:
                <br />
                Email: admin@astradigital.id
                <br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block md:w-1/2 bg-blue-900">
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-md text-white">
              <h2 className="text-3xl font-bold mb-4">Selamat Datang di Astra Digital</h2>
              <p className="text-gray-300 mb-6">
                Masuk untuk mengakses fitur admin dari Astra Digital.
              </p>
              <Image
                src="https://adiwebstprdsea.blob.core.windows.net/astradigital-be/assets/images/medium_Data_Intelligence_27afac2ec2.png"
                alt="Astra Digital Preview"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
