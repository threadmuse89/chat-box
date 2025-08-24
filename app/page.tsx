"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function HomePage() {
  const { user, login, error, isLoading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
    } catch (err) {
      // Error is handled by the auth provider
    }
  }

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onToggleMode={() => setIsSignUp(!isSignUp)}
        isSignUp={isSignUp}
        error={error}
        isLoading={isLoading}
      />
    )
  }

  return <ChatInterface />
}
