"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Moon, Sun, Target, Users, Lightbulb, Award } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Expert AI.</h1>
            <nav className="hidden md:flex space-x-6">
              <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
                HOME
              </Link>
              <Link href="/about" className="text-foreground font-medium">
                ABOUT US
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                CHAT
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {user && (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Expert AI</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're revolutionizing the way people interact with artificial intelligence, making advanced AI technology
            accessible to everyone through intuitive conversations.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Expert AI, we believe that artificial intelligence should be a tool that empowers everyone. Our
                mission is to bridge the gap between complex AI technology and everyday users, providing instant,
                accurate, and helpful responses to any question.
              </p>
              <p className="text-lg text-muted-foreground">
                We're committed to making AI conversations feel natural, secure, and genuinely useful for people from
                all walks of life.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Precision</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Accessibility</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Innovation</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Excellence</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  We prioritize user privacy and data security in everything we do. Your conversations remain
                  confidential and protected.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Continuous Learning</CardTitle>
                <CardDescription>
                  We're constantly improving our AI models and user experience based on feedback and the latest
                  technological advances.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User-Centric Design</CardTitle>
                <CardDescription>
                  Every feature we build is designed with the user in mind, ensuring intuitive and meaningful
                  interactions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by Experts</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Our team consists of AI researchers, software engineers, and UX designers who are passionate about creating
            the future of human-AI interaction.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Research Team</h3>
              <p className="text-muted-foreground">
                Leading experts in machine learning and natural language processing
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Engineering Team</h3>
              <p className="text-muted-foreground">Full-stack developers building scalable and reliable AI systems</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Team</h3>
              <p className="text-muted-foreground">UX/UI specialists focused on creating intuitive user experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Future of AI</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us on this journey to make AI more accessible, helpful, and human-friendly.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">Start Chatting Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
