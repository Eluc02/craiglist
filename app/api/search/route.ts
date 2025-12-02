import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEmbedding, openRouter } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { query, prompt } = await req.json();
        const userQuery = query || prompt;

        if (!userQuery) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // 1. Generate embedding for the user query
        const embedding = await generateEmbedding(userQuery);
        const embeddingString = `[${embedding.join(',')}]`;

        // 2. Perform vector search
        const { rows: listings } = await db.query(
            `SELECT id, title, description, price, location, category, images, metadata,
              1 - (embedding <=> $1) as similarity
       FROM listings
       ORDER BY embedding <=> $1
       LIMIT 5`,
            [embeddingString]
        );

        // 3. Use LLM to summarize and generate a response
        const listingsContext = listings.map((l, i) => `
      Option ${i + 1}:
      Title: ${l.title}
      Price: $${l.price}
      Location: ${l.location}
      Description: ${l.description}
      Trust Score: ${l.metadata.trust_score}
      URL: ${l.metadata.url}
    `).join('\n\n');

        const systemPrompt = `
      You are an AI assistant for a modern Craigslist. The user is looking for something.
      Here are the top matches found in the database:
      ${listingsContext}

      User Query: "${userQuery}"

      Please provide a helpful response to the user.
      1. Summarize the best options based on their query.
      2. Highlight any pros/cons or trust signals.
      3. Be conversational and helpful.
      4. Use Markdown for formatting (bold, bullet points, links).
      5. If no good matches are found, say so politely.
    `;

        // Use OpenRouter SDK for streaming
        const stream = await openRouter.chat.send({
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful shopping assistant.' },
                { role: 'user', content: systemPrompt }
            ],
            stream: true,
            streamOptions: { includeUsage: true }
        });

        // Create a readable stream from the OpenRouter response
        const readableStream = new ReadableStream({
            async start(controller) {
                console.log('Stream started');
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices?.[0]?.delta?.content;
                        if (content) {
                            console.log('Chunk received:', content);
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                } catch (e) {
                    console.error('Stream error:', e);
                    controller.error(e);
                } finally {
                    console.log('Stream closed');
                    controller.close();
                }
            },
        });

        const response = new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'x-listings-data': JSON.stringify(listings),
            },
        });
        console.log('Sent listings data. First listing similarity:', listings[0]?.similarity);
        return response;

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
