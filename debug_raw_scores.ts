import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('API Key present:', !!process.env.OPENROUTER_API_KEY);

async function debugScores() {
    const { db } = await import('./lib/db');
    const { generateEmbedding } = await import('./lib/ai');

    const queries = ["car", "tutor"];

    for (const query of queries) {
        console.log(`\nQuery: "${query}"`);
        const embedding = await generateEmbedding(query);
        const embeddingString = `[${embedding.join(',')}]`;

        const { rows: listings } = await db.query(
            `SELECT title, description, 1 - (embedding <=> $1) as similarity
             FROM listings
             ORDER BY similarity DESC
             LIMIT 3`,
            [embeddingString]
        );

        listings.forEach(l => {
            console.log(`[${l.similarity.toFixed(4)}] ${l.title}`);
        });
    }

    await db.pool.end();
}

debugScores().catch(console.error);
