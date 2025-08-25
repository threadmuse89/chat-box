"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function SelectPlanPage() {
  const { user, selectPlan } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSelectPlan = async (plan: "free" | "pro") => {
    setIsLoading(true)
    try {
      await selectPlan(plan)
      router.push("/")
    } catch (error) {
      console.error("Failed to select plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Diagonal stripes background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-[-50%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-[-25%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-[0%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-[25%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-[50%]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            SELECT THE
            <br />
            RIGHT PLAN
            <br />
            FOR YOU
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
            Affordable pricing to meet all your requirements.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* Free Plan */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Free</h3>
                <p className="text-gray-400 text-sm">limited chat per day 50 per day</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">$0</div>
                <div className="text-gray-400 text-sm">/14 days</div>
              </div>
            </div>
            <Button
              onClick={() => handleSelectPlan("free")}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              select
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4">
              <span className="bg-black/20 text-white text-xs px-3 py-1 rounded-full">Most popular</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Pro</h3>
                <p className="text-white/80 text-sm">Unlimited Chats</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">$2</div>
                <div className="text-white/80 text-sm">/mo</div>
              </div>
            </div>
            <Button
              onClick={() => handleSelectPlan("pro")}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              select
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Welcome, {user.name || user.email}! Choose your plan to get started.</p>
        </div>
      </div>
    </div>
  )
}
