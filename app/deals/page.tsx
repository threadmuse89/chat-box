"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Clock, Moon, Sun, LogOut } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth/auth-provider"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

function DealsPage() {
  const { user, logout } = useAuth()
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 12, minutes: 30, seconds: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const plans = [
    {
      name: "Free Trial",
      price: "Free",
      period: "/7 days",
      description: "Try Expert AI risk-free for a full week",
      features: ["Unlimited AI conversations", "Full chat history", "All features included", "No credit card required"],
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Monthly",
      price: "$2.50",
      period: "/month",
      description: "Continue with our affordable monthly plan after your free trial",
      features: [
        "Unlimited AI conversations",
        "Advanced chat history & search",
        "Priority support",
        "Custom AI personalities",
        "Mobile app access",
        "Export conversations",
      ],
      popular: true,
      cta: "Get Started",
    },
    {
      name: "Annual",
      price: "$25",
      period: "/year",
      description: "Save 17% with our annual plan - just $2.08/month",
      features: [
        "Everything in Monthly",
        "Advanced analytics",
        "Priority customer support",
        "Early access to new features",
        "Custom integrations",
        "Team collaboration tools",
      ],
      popular: false,
      cta: "Save with Annual",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-foreground">Expert AI.</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
                  HOME
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  ABOUT US
                </Link>
                <Link href="/deals" className="text-foreground font-medium">
                  DEALS
                </Link>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  CHAT
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              {user && (
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">Supercharge Your Productivity with AI</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your AI-powered conversations. Get instant answers, creative solutions, and
            intelligent assistance.
          </p>
        </div>
      </section>

      {/* Limited Time Offer Banner */}
      <section className="py-8 px-4 bg-accent/10">
        <div className="container mx-auto">
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Star className="h-6 w-6 text-accent" />
                    7-Day Free Trial + Only $2.50/Month!
                  </h3>
                  <p className="text-muted-foreground">
                    Start with a full 7-day free trial, then continue for just $2.50 per month. No hidden fees, cancel
                    anytime.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-accent">
                    <Clock className="h-5 w-5" />
                    <span className="font-mono text-lg">
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h3>
            <p className="text-muted-foreground text-lg">Flexible pricing options designed to grow with your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Feature Comparison</h3>
            <p className="text-muted-foreground text-lg">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-lg border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 text-foreground font-semibold">Features</th>
                  <th className="text-center p-6 text-foreground font-semibold">Free Trial</th>
                  <th className="text-center p-6 text-foreground font-semibold bg-primary/5">Monthly</th>
                  <th className="text-center p-6 text-foreground font-semibold">Annual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Free Trial Period", "7 days", "7 days", "7 days"],
                  ["Monthly Price After Trial", "$2.50", "$2.50", "$25/year"],
                  ["Monthly Conversations", "Unlimited", "Unlimited", "Unlimited"],
                  ["Chat History", "Full", "Advanced", "Advanced"],
                  ["Support", "Email", "Priority", "Priority"],
                  ["Mobile App", "✓", "✓", "✓"],
                  ["Export Data", "✓", "✓", "✓"],
                  ["Analytics", "Basic", "Basic", "Advanced"],
                  ["Team Features", "✗", "✗", "✓"],
                ].map((row, index) => (
                  <tr key={index} className={`border-b border-border ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
                    <td className="p-6 text-foreground font-medium">{row[0]}</td>
                    <td className="p-6 text-center text-muted-foreground">{row[1]}</td>
                    <td className="p-6 text-center text-foreground bg-primary/5">{row[2]}</td>
                    <td className="p-6 text-center text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Ready to Transform Your Workflow?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using Expert AI to boost their productivity and creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function DealsPageWrapper() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DealsPage />
    </ThemeProvider>
  )
}
