"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut, Send, Moon, Sun, Bot, User, MessageSquare, Plus, Trash2, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt?: Date
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export function ChatInterface() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant powered by Groq. How can I help you today?",
      role: "assistant",
      createdAt: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedHistories = localStorage.getItem("chatHistories")
    if (savedHistories) {
      const histories: ChatHistory[] = JSON.parse(savedHistories).map((h: any) => ({
        ...h,
        createdAt: new Date(h.createdAt),
        updatedAt: new Date(h.updatedAt),
        messages: h.messages.map((m: any) => ({
          ...m,
          createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
        })),
      }))
      setChatHistories(histories)

      // Load the most recent chat if available
      if (histories.length > 0) {
        const mostRecent = histories.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0]
        setCurrentChatId(mostRecent.id)
        setMessages(mostRecent.messages)
      } else {
        // Create initial chat
        createNewChat()
      }
    } else {
      // Create initial chat
      createNewChat()
    }
  }, [])

  useEffect(() => {
    if (currentChatId && messages.length > 1) {
      // Don't save if only welcome message
      saveChatHistory()
    }
  }, [messages, currentChatId])

  const saveChatHistory = () => {
    if (!currentChatId) return

    const chatTitle = generateChatTitle(messages)
    const updatedChat: ChatHistory = {
      id: currentChatId,
      title: chatTitle,
      messages,
      createdAt: chatHistories.find((c) => c.id === currentChatId)?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    const updatedHistories = chatHistories.filter((c) => c.id !== currentChatId)
    updatedHistories.unshift(updatedChat)

    setChatHistories(updatedHistories)
    localStorage.setItem("chatHistories", JSON.stringify(updatedHistories))
  }

  const generateChatTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
    }
    return `Chat ${new Date().toLocaleDateString()}`
  }

  const createNewChat = () => {
    const newChatId = Date.now().toString()
    setCurrentChatId(newChatId)
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI assistant powered by Groq. How can I help you today?",
        role: "assistant",
        createdAt: new Date(),
      },
    ])
    setShowSidebar(false)
  }

  const loadChat = (chatId: string) => {
    const chat = chatHistories.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
      setShowSidebar(false)
    }
  }

  const deleteChat = (chatId: string) => {
    const updatedHistories = chatHistories.filter((c) => c.id !== chatId)
    setChatHistories(updatedHistories)
    localStorage.setItem("chatHistories", JSON.stringify(updatedHistories))

    if (currentChatId === chatId) {
      if (updatedHistories.length > 0) {
        const mostRecent = updatedHistories[0]
        setCurrentChatId(mostRecent.id)
        setMessages(mostRecent.messages)
      } else {
        createNewChat()
      }
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending request to /api/chat")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      console.log("[v0] Got streaming response, starting to read stream")
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          console.log("[v0] Received chunk:", chunk)

          if (chunk.trim()) {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: msg.content + chunk } : msg)),
            )
          }
        }
      }
      console.log("[v0] Stream completed")
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          createdAt: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div
        className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:block ${showSidebar ? "block" : "hidden lg:block"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={createNewChat} className="w-9 h-9 p-0">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)} className="w-9 h-9 p-0 lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                    currentChatId === chat.id ? "bg-accent" : ""
                  }`}
                  onClick={() => loadChat(chat.id)}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{chat.updatedAt.toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(chat.id)
                    }}
                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {chatHistories.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chat history yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(true)} className="w-9 h-9 p-0 lg:hidden">
              <Menu className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {user?.name || user?.email?.split("@")[0]}
              </span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0 touch-manipulation">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground touch-manipulation"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 mt-1 shrink-0">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] xs:max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${message.role === "user" ? "order-1" : "order-2"}`}
                >
                  <Card
                    className={`p-2.5 sm:p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-card text-card-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  </Card>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {message.createdAt
                      ? message.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 mt-1 order-2 shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 mt-1 shrink-0">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-card text-card-foreground p-2.5 sm:p-3 max-w-[80%] xs:max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">AI is thinking...</span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0 pb-safe">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 min-h-[44px] text-base touch-manipulation"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="min-w-[44px] h-[44px] p-0 touch-manipulation shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowSidebar(false)} />
      )}
    </div>
  )
}
