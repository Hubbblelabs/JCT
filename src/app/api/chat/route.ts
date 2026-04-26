export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages, session_id = "default" } = await req.json();
    
    const lastUserMessage = messages
      .filter((m: any) => m.role === "user")
      .pop()?.content || "";

    const response = await fetch("http://127.0.0.1:8001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: lastUserMessage,
        session_id: session_id
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Backend error: ${errorText}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream from FastAPI
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          // Send as SSE chunk
          const chunk = JSON.stringify({ text });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        }
        
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("Chat proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
