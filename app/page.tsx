'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Send } from 'lucide-react';
import { ListingCard } from '@/components/ListingCard';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useCompletion } from '@ai-sdk/react';

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: '/api/search',
    streamProtocol: 'text',
    fetch: async (url, options) => {
      console.log('Fetching...', url);
      const response = await fetch(url, options);
      console.log('Response status:', response.status);
      const listingsHeader = response.headers.get('x-listings-data');
      if (listingsHeader) {
        try {
          const data = JSON.parse(listingsHeader);
          setListings(data);
        } catch (e) {
          console.error('Failed to parse listings header', e);
        }
      }
      return response;
    },
    onError: (error) => {
      console.error('Completion error:', error);
    },
    onFinish: (prompt, completion) => {
      console.log('Completion finished:', completion);
    },
  });

  useEffect(() => {
    // Load default listings on mount
    fetch('/api/listings/recent')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      })
      .catch((err) => console.error('Failed to fetch recent listings', err));
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Discovery, <span className="text-primary">Reimagined</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Find exactly what you're looking for with AI-powered semantic search.
            No more keywords, just natural conversation.
          </p>

          <form onSubmit={onSubmit} className="relative mx-auto max-w-2xl">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Describe what you need (e.g., 'Cheap apartment in Mission with sunlight')..."
                style={{ colorScheme: 'light' }}
                className="block w-full rounded-full border-0 py-4 pl-12 pr-12 text-black bg-white opacity-100 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {(completion || isLoading || listings.length > 0) && (
          <div className="space-y-8">
            {/* AI Summary */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <div className="min-h-[60px]">
                <MarkdownRenderer content={completion} />
                {isLoading && !completion && (
                  <span className="animate-pulse text-muted-foreground">Thinking...</span>
                )}
              </div>
            </div>

            {/* Listings Grid */}
            {listings.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold tracking-tight">Top Matches</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing: any) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!completion && !isLoading && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Try searching for something to see results.</p>
          </div>
        )}
      </div>
    </main>
  );
}
