"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useTheme } from "next-themes"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onToggleMode: () => void
  isSignUp: boolean
  error?: string
  isLoading?: boolean
}

export function LoginForm({ onLogin, onToggleMode, isSignUp, error, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      await onLogin(email, password)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 bg-black relative overflow-hidden flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-8 relative z-10">
          <div className="text-white text-2xl font-bold">Expert AI.</div>
          <div className="flex items-center space-x-8 text-white">
            <a href="#" className="hover:text-gray-300 transition-colors">
              HOME
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              ABOUT US
            </a>
            <a href="#" className="text-white font-semibold">
              LOG IN
            </a>
          </div>
        </nav>

        {/* Metallic rings background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-96 h-96 rounded-full border-4 border-gray-400 opacity-30"></div>
            <div className="absolute top-8 left-8 w-80 h-80 rounded-full border-4 border-gray-300 opacity-40"></div>
            <div className="absolute top-16 left-16 w-64 h-64 rounded-full border-4 border-gray-200 opacity-50"></div>
            <div className="absolute top-24 left-24 w-48 h-48 rounded-full border-4 border-white opacity-20"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <h1 className="text-white text-6xl font-bold leading-tight mb-8">Chat box AI.</h1>
          <p className="text-white text-3xl font-light">
            quick solution of
            <br />
            every question
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Log in</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-300"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-transparent p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </Button>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-gray-600 text-sm">Remember Me</span>
              </label>
              <a href="#" className="text-gray-500 text-sm hover:text-gray-700">
                Forgot Password?
              </a>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              {isLoading ? "Please wait..." : "Log in"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Sign up button */}
            <Button
              type="button"
              onClick={onToggleMode}
              variant="outline"
              className="w-full py-4 bg-gray-100 text-gray-700 border-0 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
