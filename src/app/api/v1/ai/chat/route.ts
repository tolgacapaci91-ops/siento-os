import { NextResponse } from "next/server";
import { aiKnowledgeBase } from "./aiData";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Mesaj bulunamadı" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].text.toLowerCase();
    
    let replyText = "Bunu anladığımdan emin değilim. Lütfen biraz daha detay verir misiniz? Size daha iyi yardımcı olabilmem için YouTube, teknoloji veya akademi hakkında özel bir şey sorabilirsiniz.";

    // Search through Knowledge Base
    for (const item of aiKnowledgeBase) {
      // Check if any keyword matches the user message
      if (item.keywords.some(keyword => lastMessage.includes(keyword.toLowerCase()))) {
        replyText = item.response;
        break;
      }
    }

    // Simulate network delay to feel like "typing"
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({ 
      data: {
        reply: replyText
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
