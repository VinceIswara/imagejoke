// supabase/functions/openai-proxy/index.ts
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import OpenAI from 'https://esm.sh/openai@4.28.0'

interface RequestBody {
  image?: string;
  prompt?: string;
}

const RATE_LIMIT = 10; // requests per minute
const requestCounts = new Map();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Rate limiting
  const clientIP = req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const minute = Math.floor(now / 60000);

  const count = requestCounts.get(`${clientIP}:${minute}`) || 0;
  if (count >= RATE_LIMIT) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: corsHeaders }
    );
  }
  requestCounts.set(`${clientIP}:${minute}`, count + 1);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!req.body) {
      throw new Error('Request body is empty');
    }

    const { image, prompt } = await req.json() as RequestBody;
    
    if (!image && !prompt) {
      throw new Error('Either image or prompt is required');
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    });

    if (image) {
      console.log('Processing image...');
      // First, analyze the image
      const imageAnalysis = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant that describes images clearly and concisely." 
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What's in this image? Provide a clear, concise description."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });

      const description = imageAnalysis.choices[0].message.content;
      console.log('Description:', description);

      // Then, generate a joke based on the description
      const jokeGeneration = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a clever comedian. Create a short, witty joke based on the given description."
          },
          {
            role: "user",
            content: `Create a funny joke based on this description: ${description}`
          }
        ],
        max_tokens: 300
      });

      return new Response(
        JSON.stringify({
          description: description,
          joke: jokeGeneration.choices[0].message.content
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle direct joke prompts (not used in current implementation)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a clever comedian. Create a short, witty joke."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300
    });

    return new Response(
      JSON.stringify({ result: completion.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});