"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function HomePage() {
  const { user, login, signup, error, isLoading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
    } catch (err) {
      // Error is handled by the auth provider
    }
  }

  const handleSignup = async (email: string, password: string, confirmPassword: string) => {
    try {
      await signup(email, password, confirmPassword)
    } catch (err) {
      // Error is handled by the auth provider
    }
  }

  if (user && !user.hasSelectedPlan) {
    router.push("/select-plan")
    return null
  }

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSignup={handleSignup}
        onToggleMode={() => setIsSignUp(!isSignUp)}
        isSignUp={isSignUp}
        error={error}
        isLoading={isLoading}
      />
    )
  }

  return <ChatInterface />
}
