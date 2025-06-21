import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


const apiKey = process.env.OPENAI_API_KEY;

export const runtime = 'edge';



export async function POST(req: Request) {
  console.log("I am called"); // this is a comment i added to test wether the api is working or not
  console.log(apiKey);
  
  const { messages } = await req.json();
  console.log(messages);

; 

  const result = await streamText({
    model: openai('gpt-4o'),
    messages, // Using original messages for now
  });

  console.log(result.textStream);
  // Pipe the AI stream to a native Response object
  return new Response(result.textStream.pipeThrough(new TextEncoderStream()));
}