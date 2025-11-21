import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('Database URL exists:', !!process.env.DATABASE_URL);
console.log('OpenRouter Key exists:', !!process.env.OPENROUTER_API_KEY);

// Use dynamic imports to ensure env vars are loaded before modules are initialized
// const { db } = await import('../lib/db');
// const { generateEmbedding } = await import('../lib/ai');

const sampleListings = [
    // Housing
    {
        title: 'Sunny 1BR in Mission District',
        description: 'Beautiful 1 bedroom apartment with lots of natural light. Hardwood floors, updated kitchen. Close to BART and parks. Cats ok.',
        price: 2400,
        location: 'Mission District, San Francisco',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?q=80&w=3274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        metadata: {
            contact: 'email@example.com',
            trust_score: 0.9,
            url: 'https://sfbay.craigslist.org/sfc/apa/d/san-francisco-sunny-1br-in-mission/1234567890.html'
        },
    },
    {
        title: 'Room in shared house',
        description: 'Large room available in a 4BR house. Shared bathroom. Big backyard. We are 3 professionals in our 20s.',
        price: 1100,
        location: 'Oakland',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'room@example.com',
            trust_score: 0.88,
            url: 'https://sfbay.craigslist.org/eby/roo/d/oakland-room-in-shared-house/1234567891.html'
        },
    },
    {
        title: 'Modern Studio in Downtown',
        description: 'Sleek studio apartment in the heart of the city. Gym and pool in building. 24/7 security.',
        price: 2100,
        location: 'Downtown, San Francisco',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'downtown@example.com',
            trust_score: 0.95,
            url: 'https://sfbay.craigslist.org/sfc/apa/d/san-francisco-modern-studio/1234567892.html'
        },
    },
    {
        title: 'Cozy Cottage in Berkeley',
        description: 'Small detached cottage in a quiet garden setting. Perfect for a student or writer. Near UC Berkeley.',
        price: 1600,
        location: 'Berkeley',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'cottage@example.com',
            trust_score: 0.92,
            url: 'https://sfbay.craigslist.org/eby/apa/d/berkeley-cozy-cottage/1234567893.html'
        },
    },
    {
        title: 'Luxury 2BR with Bay View',
        description: 'Stunning views of the bay bridge. High-end appliances, in-unit washer/dryer, parking included.',
        price: 4500,
        location: 'Rincon Hill, San Francisco',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'luxury@example.com',
            trust_score: 0.98,
            url: 'https://sfbay.craigslist.org/sfc/apa/d/san-francisco-luxury-2br/1234567894.html'
        },
    },
    {
        title: 'Artist Loft in Dogpatch',
        description: 'Huge open space, high ceilings, industrial vibe. Live/work allowed. Great for creatives.',
        price: 3200,
        location: 'Dogpatch, San Francisco',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'loft@example.com',
            trust_score: 0.85,
            url: 'https://sfbay.craigslist.org/sfc/apa/d/san-francisco-artist-loft/1234567895.html'
        },
    },

    // For Sale
    {
        title: 'Vintage Leather Sofa',
        description: 'Mid-century modern leather sofa. Good condition, some wear on the arms. Must pick up.',
        price: 500,
        location: 'Hayes Valley, San Francisco',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'phone@example.com',
            trust_score: 0.8,
            url: 'https://sfbay.craigslist.org/sfc/fuo/d/san-francisco-vintage-sofa/1234567896.html'
        },
    },
    {
        title: '2015 Honda Civic',
        description: 'Reliable car, 80k miles. Clean title. New tires. Great commuter car.',
        price: 12000,
        location: 'Daly City',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'car@example.com',
            trust_score: 0.85,
            url: 'https://sfbay.craigslist.org/pen/cto/d/daly-city-honda-civic/1234567897.html'
        },
    },
    {
        title: 'MacBook Pro M1 16"',
        description: 'Like new, 16GB RAM, 512GB SSD. Includes original box and charger. Battery cycle count 45.',
        price: 1500,
        location: 'SoMa, San Francisco',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'mac@example.com',
            trust_score: 0.9,
            url: 'https://sfbay.craigslist.org/sfc/sys/d/san-francisco-macbook-pro/1234567898.html'
        },
    },
    {
        title: 'Mountain Bike - Trek Marlin',
        description: 'Great condition, recently tuned up. 29 inch wheels. Perfect for trails.',
        price: 450,
        location: 'Marin',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'bike@example.com',
            trust_score: 0.88,
            url: 'https://sfbay.craigslist.org/nby/bik/d/marin-trek-marlin/1234567899.html'
        },
    },
    {
        title: 'IKEA Malm Dresser',
        description: 'White, 6 drawers. A few scratches but fully functional. Moving sale.',
        price: 80,
        location: 'Sunset, San Francisco',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'dresser@example.com',
            trust_score: 0.7,
            url: 'https://sfbay.craigslist.org/sfc/fuo/d/san-francisco-ikea-dresser/1234567900.html'
        },
    },
    {
        title: 'Sony A7III Camera Body',
        description: 'Excellent condition, low shutter count. Comes with battery and strap.',
        price: 1400,
        location: 'San Jose',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'camera@example.com',
            trust_score: 0.93,
            url: 'https://sfbay.craigslist.org/sby/pho/d/san-jose-sony-a7iii/1234567901.html'
        },
    },
    {
        title: 'Surfboard - 7ft Funboard',
        description: 'Good beginner board. Watertight, ready to ride. Includes leash and fins.',
        price: 250,
        location: 'Pacifica',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1531722569936-825d3dd91b15?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'surf@example.com',
            trust_score: 0.82,
            url: 'https://sfbay.craigslist.org/pen/spo/d/pacifica-surfboard/1234567902.html'
        },
    },

    // Jobs / Gigs
    {
        title: 'Junior Web Developer',
        description: 'Looking for a junior web developer with React and Node.js experience. Remote friendly.',
        price: 0,
        location: 'Remote / SF',
        category: 'jobs',
        images: [],
        metadata: {
            company: 'Tech Startup',
            contact: 'jobs@example.com',
            trust_score: 0.95,
            url: 'https://sfbay.craigslist.org/sfc/sof/d/san-francisco-junior-dev/1234567903.html'
        },
    },
    {
        title: 'Wedding Photographer Needed',
        description: 'Seeking a photographer for a small wedding in Napa. 6 hours coverage. Style: candid, natural.',
        price: 2000,
        location: 'Napa',
        category: 'gigs',
        images: [],
        metadata: {
            contact: 'wedding@example.com',
            trust_score: 0.8,
            url: 'https://sfbay.craigslist.org/nby/crg/d/napa-wedding-photographer/1234567904.html'
        },
    },
    {
        title: 'Barista - Part Time',
        description: 'Friendly neighborhood cafe looking for an experienced barista. Weekend availability required.',
        price: 20, // Hourly rate
        location: 'North Beach, San Francisco',
        category: 'jobs',
        images: [],
        metadata: {
            company: 'Cafe Roma',
            contact: 'cafe@example.com',
            trust_score: 0.9,
            url: 'https://sfbay.craigslist.org/sfc/fbh/d/san-francisco-barista/1234567905.html'
        },
    },
    {
        title: 'Dog Walker / Pet Sitter',
        description: 'Love dogs? Join our team of walkers. Flexible hours, great pay.',
        price: 25, // Hourly
        location: 'San Francisco',
        category: 'jobs',
        images: [],
        metadata: {
            company: 'SF Paws',
            contact: 'paws@example.com',
            trust_score: 0.92,
            url: 'https://sfbay.craigslist.org/sfc/etc/d/san-francisco-dog-walker/1234567906.html'
        },
    },
    {
        title: 'Moving Help Needed',
        description: 'Need 2 strong people to help move furniture into a 2nd floor apartment. 3 hours max.',
        price: 150, // Total
        location: 'Richmond District, San Francisco',
        category: 'gigs',
        images: [],
        metadata: {
            contact: 'move@example.com',
            trust_score: 0.75,
            url: 'https://sfbay.craigslist.org/sfc/lbg/d/san-francisco-moving-help/1234567907.html'
        },
    },
    {
        title: 'Graphic Designer for Logo',
        description: 'Need a modern logo for a new coffee brand. One time project.',
        price: 300,
        location: 'Remote',
        category: 'gigs',
        images: [],
        metadata: {
            contact: 'design@example.com',
            trust_score: 0.85,
            url: 'https://sfbay.craigslist.org/sfc/crg/d/san-francisco-logo-design/1234567908.html'
        },
    },

    // Services
    {
        title: 'Professional House Cleaning',
        description: 'Deep cleaning, move-in/move-out, regular maintenance. Eco-friendly products.',
        price: 40, // Hourly
        location: 'San Francisco Bay Area',
        category: 'services',
        images: [],
        metadata: {
            contact: 'clean@example.com',
            trust_score: 0.94,
            url: 'https://sfbay.craigslist.org/sfc/hss/d/san-francisco-house-cleaning/1234567909.html'
        },
    },
    {
        title: 'Math Tutor - Calculus/Algebra',
        description: 'Experienced tutor (PhD student) available for high school and college math tutoring.',
        price: 60, // Hourly
        location: 'Berkeley / Online',
        category: 'services',
        images: [],
        metadata: {
            contact: 'tutor@example.com',
            trust_score: 0.96,
            url: 'https://sfbay.craigslist.org/eby/lss/d/berkeley-math-tutor/1234567910.html'
        },
    },
    {
        title: 'Handyman Services',
        description: 'Plumbing, electrical, painting, furniture assembly. No job too small.',
        price: 50, // Hourly
        location: 'San Francisco',
        category: 'services',
        images: [],
        metadata: {
            contact: 'handy@example.com',
            trust_score: 0.89,
            url: 'https://sfbay.craigslist.org/sfc/sks/d/san-francisco-handyman/1234567911.html'
        },
    },
    {
        title: 'Guitar Lessons',
        description: 'Learn to play acoustic or electric guitar. All levels welcome. First lesson free.',
        price: 40, // Hourly
        location: 'Haight Ashbury, San Francisco',
        category: 'services',
        images: [],
        metadata: {
            contact: 'guitar@example.com',
            trust_score: 0.91,
            url: 'https://sfbay.craigslist.org/sfc/lss/d/san-francisco-guitar-lessons/1234567912.html'
        },
    },

    // More Housing
    {
        title: 'Victorian Flat in Alamo Square',
        description: 'Classic SF flat with high ceilings, bay windows, and fireplace. Across from the park.',
        price: 3800,
        location: 'Alamo Square, San Francisco',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1506126279646-a697353d3166?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'alamo@example.com',
            trust_score: 0.97,
            url: 'https://sfbay.craigslist.org/sfc/apa/d/san-francisco-victorian-flat/1234567913.html'
        },
    },
    {
        title: 'Sublet: 1 Month in Castro',
        description: 'Furnished room available for August. Great location, fun roommates.',
        price: 1200,
        location: 'Castro, San Francisco',
        category: 'housing',
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'sublet@example.com',
            trust_score: 0.85,
            url: 'https://sfbay.craigslist.org/sfc/sub/d/san-francisco-sublet-castro/1234567914.html'
        },
    },

    // More For Sale
    {
        title: 'Herman Miller Aeron Chair',
        description: 'Size B. Fully loaded. Graphite color. Excellent condition.',
        price: 600,
        location: 'Financial District, San Francisco',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'chair@example.com',
            trust_score: 0.92,
            url: 'https://sfbay.craigslist.org/sfc/fuo/d/san-francisco-aeron-chair/1234567915.html'
        },
    },
    {
        title: 'Espresso Machine - Breville',
        description: 'Barista Express. Works perfectly. Includes all accessories.',
        price: 400,
        location: 'Potrero Hill, San Francisco',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'coffee@example.com',
            trust_score: 0.88,
            url: 'https://sfbay.craigslist.org/sfc/app/d/san-francisco-espresso/1234567916.html'
        },
    },
    {
        title: 'Camping Gear Bundle',
        description: 'Tent, 2 sleeping bags, stove, and cooler. Used twice.',
        price: 200,
        location: 'Berkeley',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'camp@example.com',
            trust_score: 0.86,
            url: 'https://sfbay.craigslist.org/eby/spo/d/berkeley-camping-gear/1234567917.html'
        },
    },
    {
        title: 'Vintage Vinyl Record Collection',
        description: 'Over 100 records. Rock, Jazz, Blues from 60s/70s. Selling as a lot.',
        price: 300,
        location: 'Oakland',
        category: 'for sale',
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'],
        metadata: {
            contact: 'records@example.com',
            trust_score: 0.9,
            url: 'https://sfbay.craigslist.org/eby/clt/d/oakland-vinyl-records/1234567918.html'
        },
    }
];

async function seed() {
    console.log('Seeding data...');

    // Dynamic imports here to ensure env vars are loaded first
    const { db } = await import('../lib/db');
    const { generateEmbedding } = await import('../lib/ai');

    try {
        // Drop table to ensure schema update
        await db.query('DROP TABLE IF EXISTS listings');

        // Create table if not exists (schema.sql should handle this but good to be safe or run schema first)
        // For now assuming schema is applied manually or via another script.
        // Actually let's just run the schema creation here for convenience if it's simple.
        await db.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
      CREATE TABLE IF NOT EXISTS listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        images TEXT[],
        metadata JSONB DEFAULT '{}',
        embedding vector(1536),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Clear existing data to avoid duplicates during re-seeding
        await db.query('TRUNCATE listings');
        console.log('Cleared existing listings.');

        for (const listing of sampleListings) {
            const textToEmbed = `${listing.title} ${listing.description} ${listing.location} ${listing.category}`;
            const embedding = await generateEmbedding(textToEmbed);

            // pgvector requires array string format like '[1,2,3]'
            const embeddingString = `[${embedding.join(',')}]`;

            // Images are now at top level
            const images = listing.images || [];
            const metadata = listing.metadata;

            await db.query(
                `INSERT INTO listings (title, description, price, location, category, images, metadata, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    listing.title,
                    listing.description,
                    listing.price,
                    listing.location,
                    listing.category,
                    images,
                    metadata,
                    embeddingString,
                ]
            );
            console.log(`Inserted: ${listing.title}`);
        }
        console.log('Seeding complete.');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        if (db) await db.pool.end();
    }
}

seed().catch(console.error);
