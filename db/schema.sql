-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Stores images, contact info, trust signals
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for faster similarity search
-- IVFFlat is good for approximate nearest neighbor search
-- We need some data for this to be effective, but defining it here is fine.
-- Note: For production with many rows, HNSW is often preferred but IVFFlat is simpler to start.
-- CREATE INDEX ON listings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
