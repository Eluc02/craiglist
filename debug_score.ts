import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from './lib/db';
import { generateEmbedding } from './lib/ai';

async function debugSearch() {
    const query = 'bike';
    console.log(`Searching for: "${query}"`);

    const embedding = await generateEmbedding(query);
    const embeddingString = `[${embedding.join(',')}]`;

    const { rows: listings } = await db.query(
        `SELECT title, 1 - (embedding <=> $1) as similarity
         FROM listings
         ORDER BY embedding <=> $1
         LIMIT 5`,
        [embeddingString]
    );

    console.log('Results for "bike":');
    listings.forEach(l => console.log(`${l.title}: ${l.similarity}`));

    const query2 = 'banana';
    console.log(`\nSearching for: "${query2}"`);
    const embedding2 = await generateEmbedding(query2);
    const embeddingString2 = `[${embedding2.join(',')}]`;

    const { rows: listings2 } = await db.query(
        `SELECT title, 1 - (embedding <=> $1) as similarity
         FROM listings
         ORDER BY embedding <=> $1
         LIMIT 5`,
        [embeddingString2]
    );
    console.log('Results for "banana":');
    listings2.forEach(l => console.log(`${l.title}: ${l.similarity}`));

    await db.pool.end();
}

debugSearch().catch(console.error);
