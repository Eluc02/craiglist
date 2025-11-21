import { OpenRouter } from '@openrouter/sdk';

export const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await openRouter.embeddings.generate({
        model: 'text-embedding-3-small',
        input: text,
    });

    // The SDK might return data slightly differently.
    // If the previous attempt failed with "Property 'create' does not exist", then I should use 'generate' as the user snippet showed.
    // Wait, I am writing the SAME code again if I use 'create'.
    // I MUST use 'generate'.

    return (response as any).data[0].embedding;
}

export async function chatCompletion(messages: any[]) {
    // User snippet used 'chat.send'
    const response = await openRouter.chat.send({
        model: 'openai/gpt-4o',
        messages,
    });

    return (response as any).choices[0].message.content;
}


