
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyRelevance() {
    // Import after config
    const { db } = await import('./lib/db');
    const { generateEmbedding } = await import('./lib/ai');

    try {
        const query = "1 br apartment in san francisco";
        console.log(`Query: "${query}"`);

        // Generate embedding for "1 br apartment in san francisco"
        const embedding = await generateEmbedding(query);
        const embeddingString = `[${embedding.join(',')}]`;

        // Fetch all housing listings and their similarity
        const { rows: listings } = await db.query(
            `SELECT title, description,
              1 - (embedding <=> $1) as similarity
       FROM listings
       WHERE category = 'housing'
       ORDER BY similarity DESC
       LIMIT 10`,
            [embeddingString]
        );

        console.log('\nResults with Hybrid Boost:');
        listings.forEach(l => {
            let boost = 0;
            const lowerQuery = query.toLowerCase();
            const lowerTitle = l.title.toLowerCase();
            const lowerDesc = l.description.toLowerCase();

            // Bedroom boost (e.g. "1 br", "1 bedroom", "1bd")
            const bedroomRegex = /(\d+)\s*(?:br|bed|bd)/i;
            const queryBed = lowerQuery.match(bedroomRegex);

            if (queryBed) {
                const bedCount = queryBed[1];
                // Check if listing matches this bed count
                const listingBedRegex = new RegExp(`${bedCount}\\s*(?:br|bed|bd)`, 'i');
                if (listingBedRegex.test(lowerTitle) || listingBedRegex.test(lowerDesc)) {
                    boost += 0.15; // Boost
                }
            }

            const rawScore = l.similarity + boost;
            const calibrated = Math.min(Math.max((rawScore - 0.20) / (0.70 - 0.20), 0), 1) * 100;

            console.log(`[${calibrated.toFixed(1)}%] (${(rawScore * 100).toFixed(1)}% raw) ${l.title} ${boost > 0 ? '+BOOST' : ''}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await db.pool.end();
    }
}

verifyRelevance();
