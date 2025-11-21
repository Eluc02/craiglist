import { getListingById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, DollarSign, ShieldCheck, AlertTriangle, ExternalLink, Mail, Calendar } from 'lucide-react';

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const listing = await getListingById(id);

    if (!listing) {
        notFound();
    }

    const trustScore = listing.metadata.trust_score || 0.5;
    const isTrusted = trustScore > 0.8;
    const images = listing.images || [];

    return (
        <main className="min-h-screen bg-background pb-12">
            {/* Header / Nav */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-xl border bg-muted shadow-sm">
                            {images[0] ? (
                                <img
                                    src={images[0]}
                                    alt={listing.title}
                                    className="aspect-video w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center text-muted-foreground">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.slice(1).map((img: string, i: number) => (
                                    <div key={i} className="overflow-hidden rounded-lg border bg-muted">
                                        <img src={img} alt={`View ${i + 2}`} className="aspect-square w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {listing.category}
                                </span>
                                {isTrusted ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <ShieldCheck className="h-3 w-3" />
                                        Trusted Seller
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        <AlertTriangle className="h-3 w-3" />
                                        Moderate Risk
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{listing.title}</h1>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                                    <DollarSign className="h-6 w-6" />
                                    {listing.price.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {listing.location}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-gray max-w-none dark:prose-invert">
                            <h3 className="text-lg font-semibold">Description</h3>
                            <p className="whitespace-pre-wrap text-muted-foreground">{listing.description}</p>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
                            <div className="space-y-4">
                                {listing.metadata.contact && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <a href={`mailto:${listing.metadata.contact}`} className="text-sm text-primary hover:underline">
                                                {listing.metadata.contact}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {listing.metadata.url && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <ExternalLink className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Original Listing</p>
                                            <a
                                                href={listing.metadata.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                View on Craigslist
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Posted</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
