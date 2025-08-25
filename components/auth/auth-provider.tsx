"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name?: string
  plan?: "free" | "pro"
  hasSelectedPlan?: boolean
  planStartDate?: string
  dailyMessageCount?: number
  lastMessageDate?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => void
  selectPlan: (plan: "free" | "pro") => Promise<void>
  canSendMessage: () => { canSend: boolean; reason?: string; remainingMessages?: number; remainingDays?: number }
  incrementMessageCount: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("chatbot-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem("chatbot-user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const existingUsers = JSON.parse(localStorage.getItem("chatbot-users") || "[]")
      const existingUser = existingUsers.find((u: any) => u.email === email)

      if (!existingUser) {
        throw new Error("User not found. Please sign up first.")
      }

      if (existingUser.password !== password) {
        throw new Error("Invalid password")
      }

      const newUser: User = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        plan: existingUser.plan,
        hasSelectedPlan: existingUser.hasSelectedPlan,
        planStartDate: existingUser.planStartDate,
        dailyMessageCount: existingUser.dailyMessageCount,
        lastMessageDate: existingUser.lastMessageDate,
      }

      setUser(newUser)
      localStorage.setItem("chatbot-user", JSON.stringify(newUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      const existingUsers = JSON.parse(localStorage.getItem("chatbot-users") || "[]")
      const userExists = existingUsers.find((u: any) => u.email === email)

      if (userExists) {
        throw new Error("User already exists. Please log in instead.")
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
        hasSelectedPlan: false,
      }

      const updatedUsers = [...existingUsers, { ...newUser, password }]
      localStorage.setItem("chatbot-users", JSON.stringify(updatedUsers))

      setUser(newUser)
      localStorage.setItem("chatbot-user", JSON.stringify(newUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("chatbot-user")
  }

  const selectPlan = async (plan: "free" | "pro") => {
    if (!user) return

    try {
      const planData =
        plan === "free"
          ? {
              planStartDate: new Date().toISOString(),
              dailyMessageCount: 0,
              lastMessageDate: new Date().toDateString(),
            }
          : {}

      const updatedUser = { ...user, plan, hasSelectedPlan: true, ...planData }

      setUser(updatedUser)
      localStorage.setItem("chatbot-user", JSON.stringify(updatedUser))

      const existingUsers = JSON.parse(localStorage.getItem("chatbot-users") || "[]")
      const updatedUsers = existingUsers.map((u: any) =>
        u.id === user.id ? { ...u, plan, hasSelectedPlan: true, ...planData } : u,
      )
      localStorage.setItem("chatbot-users", JSON.stringify(updatedUsers))
    } catch (error) {
      throw new Error("Failed to select plan")
    }
  }

  const canSendMessage = () => {
    if (!user || user.plan !== "free") {
      return { canSend: true }
    }

    const now = new Date()
    const planStartDate = user.planStartDate ? new Date(user.planStartDate) : now
    const daysSincePlanStart = Math.floor((now.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSincePlanStart >= 14) {
      return {
        canSend: false,
        reason: "Your 14-day free trial has expired. Please upgrade to Pro to continue chatting.",
        remainingDays: 0,
      }
    }

    const today = now.toDateString()
    const lastMessageDate = user.lastMessageDate || today
    const dailyCount = lastMessageDate === today ? user.dailyMessageCount || 0 : 0

    if (dailyCount >= 50) {
      return {
        canSend: false,
        reason:
          "You've reached your daily limit of 50 messages. Try again tomorrow or upgrade to Pro for unlimited messages.",
        remainingMessages: 0,
        remainingDays: 14 - daysSincePlanStart,
      }
    }

    return {
      canSend: true,
      remainingMessages: 50 - dailyCount,
      remainingDays: 14 - daysSincePlanStart,
    }
  }

  const incrementMessageCount = () => {
    if (!user || user.plan !== "free") return

    const today = new Date().toDateString()
    const lastMessageDate = user.lastMessageDate || today
    const currentCount = lastMessageDate === today ? user.dailyMessageCount || 0 : 0

    const updatedUser = {
      ...user,
      dailyMessageCount: currentCount + 1,
      lastMessageDate: today,
    }

    setUser(updatedUser)
    localStorage.setItem("chatbot-user", JSON.stringify(updatedUser))

    const existingUsers = JSON.parse(localStorage.getItem("chatbot-users") || "[]")
    const updatedUsers = existingUsers.map((u: any) =>
      u.id === user.id ? { ...u, dailyMessageCount: currentCount + 1, lastMessageDate: today } : u,
    )
    localStorage.setItem("chatbot-users", JSON.stringify(updatedUsers))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        selectPlan,
        canSendMessage,
        incrementMessageCount,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
