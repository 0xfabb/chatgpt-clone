import { NextRequest, NextResponse } from 'next/server';
import Mem0 from 'mem0ai';

console.log("MEM0_API_KEY exists:", !!process.env.MEM0_API_KEY);
console.log("MEM0_API_KEY length:", process.env.MEM0_API_KEY?.length);
console.log("MEM0_API_KEY first 10 chars:", process.env.MEM0_API_KEY?.substring(0, 10));

if (!process.env.MEM0_API_KEY) {
  console.error("MEM0_API_KEY is not set! Please add MEM0_API_KEY to your .env.local file");
}

const mem0 = new Mem0({
  apiKey: process.env.MEM0_API_KEY!,
});

/**
 * GET /api/memory
 * Searches for relevant memories.
 *
 * Query parameters:
 * - query: The search query string.
 * - userId: The ID of the user performing the search.
 * - chatId: The ID of the chat session.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const userId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');

  if (!query || !userId || !chatId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  if (!process.env.MEM0_API_KEY) {
    return NextResponse.json({ error: 'MEM0_API_KEY is not configured' }, { status: 500 });
  }

  console.log("Searching memory for:", { query, userId, chatId });
  

  try {
    const searchResults = await mem0.search(query, {
      user_id: userId,
    });

    console.log("Search results:", searchResults);
    return NextResponse.json({ memories: searchResults });
  } catch (error) {
    console.error('Error searching memory:', error);
    return NextResponse.json({ error: 'Failed to search memory' }, { status: 500 });
  }
}

/**
 * POST /api/memory
 * Adds a new memory.
 *
 * Body:
 * - messages: An array of messages to be added.
 * - userId: The ID of the user.
 * - chatId: The ID of the chat session.
 */
export async function POST(req: NextRequest) {
  if (!process.env.MEM0_API_KEY) {
    console.error("MEM0_API_KEY is not set!");
    return NextResponse.json({ 
      error: 'MEM0_API_KEY is not configured. Please add MEM0_API_KEY to your .env.local file' 
    }, { status: 500 });
  }

  try {
    const { messages, userId, chatId } = await req.json();

    if (!messages || !Array.isArray(messages) || !userId || !chatId) {
      console.error('Missing required parameters:', { messages, userId, chatId });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log("Posting memory:", { messages, userId, chatId });
    
    // Filter out empty messages and ensure proper formatting
    const validMessages = messages.filter((msg: { role: string; content: string }) => 
      msg.content && msg.content.trim() && (msg.role === 'user' || msg.role === 'assistant')
    );

    if (validMessages.length === 0) {
      console.error('No valid messages to add to memory');
      return NextResponse.json({ error: 'No valid messages' }, { status: 400 });
    }

    console.log("Valid messages to add:", validMessages);

    // Try adding all messages at once
    const memoriesToAdd = validMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content.trim(),
    }));

    console.log("Adding memories batch:", memoriesToAdd);

    try {
      const result = await mem0.add(memoriesToAdd, {
        user_id: userId,
        metadata: {type: "chat"}
      });

      console.log("Memory add result:", result);
      console.log("Successfully added all memories");
      return NextResponse.json({ success: true, result });
    } catch (addError) {
      console.error("Error adding memories batch:", addError);
      
      // Fallback: try adding one by one
      console.log("Trying to add messages one by one...");
      for (const msg of validMessages) {
        console.log("Adding message to memory:", msg.role, msg.content.substring(0, 50) + "...");
        
        try {
          const singleResult = await mem0.add([{
            role: msg.role as 'user' | 'assistant',
            content: msg.content.trim(),
          }], {
            user_id: userId,
            metadata: {type: "chat"}
          });

          console.log("Single memory add result for", msg.role, ":", singleResult);
        } catch (singleError) {
          console.error("Error adding single message to memory:", msg.role, singleError);
          throw singleError;
        }
      }
      
      console.log("Successfully added all memories (one by one)");
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error adding memory:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Failed to add memory', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 