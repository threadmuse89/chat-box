import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const hasImage = messages.some((msg: any) => msg.content && typeof msg.content === "object" && msg.content.image)

    if (hasImage) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          content:
            "I'm a text-based AI and cannot process images directly. However, you can describe the image to me, and I'll do my best to help! For example, you can say 'This is a photo of a sunset over mountains' and I'll respond based on your description.",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: typeof msg.content === "string" ? msg.content : msg.content.text || "",
      })),
      system: `You are a helpful AI assistant. Be concise, friendly, and informative in your responses. 
      Keep your answers clear and well-structured. If asked about technical topics, provide accurate information.
      Always maintain a professional yet approachable tone.`,
      maxTokens: 1000,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
