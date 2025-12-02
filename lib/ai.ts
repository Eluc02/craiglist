import { OpenRouter } from '@openrouter/sdk';

export const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

console.log('API Key present:', !!process.env.OPENROUTER_API_KEY);
if (process.env.OPENROUTER_API_KEY) {
    console.log('API Key prefix:', process.env.OPENROUTER_API_KEY.substring(0, 5));
}

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



export async function analyzeListingTrust(listing: any): Promise<{ score: number; reason: string }> {
    const prompt = `
    Analyze the following listing for potential scam signals or trustworthiness.
    Consider:
    - Is the price realistic for the item and location?
    - Is the description vague or suspicious?
    - Are there any common scam keywords?

    Listing:
    Title: ${listing.title}
    Price: $${listing.price}
    Location: ${listing.location}
    Description: ${listing.description}

    Return a JSON object with:
    - "score": A number between 0 and 1 (1 = highly trustworthy, 0 = likely scam).
    - "reason": A short explanation (max 10 words).
    `;

    const response = await openRouter.chat.send({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    } as any);

    const content = (response as any).choices[0].message.content;
    const cleanedContent = content.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedContent);
}
