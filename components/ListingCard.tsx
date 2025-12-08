import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    images: string[];
    metadata: {
        trust_score?: number;
        trust_reason?: string;
        contact?: string;
        url?: string;
    };
    similarity?: number;
}

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    console.log('ListingCard listing:', listing.id, 'similarity:', listing.similarity);

    // Calibrate the raw vector score to a user-friendly percentage
    // Raw scores typically range from 0.2 (irrelevant) to 0.45 (highly relevant) for this model/data
    const getCalibratedScore = (rawScore: number) => {
        const min = 0.20;
        const max = 0.70;
        const scaled = (rawScore - min) / (max - min);
        return Math.min(Math.max(scaled, 0), 1);
    };

    const displayScore = listing.similarity !== undefined ? getCalibratedScore(listing.similarity) : 0;
    const isHighMatch = displayScore > 0.7;

    return (
        <Link
            href={`/listing/${listing.id}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20"
        >
            <div className="aspect-video w-full bg-muted object-cover">
                {listing.images?.[0] ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 text-lg font-semibold tracking-tight group-hover:text-primary">
                        {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <DollarSign className="h-4 w-4" />
                        {listing.price.toLocaleString()}
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {listing.description}
                </p>

                <div className="mt-auto flex flex-col gap-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {listing.similarity !== undefined ? (
                                <>
                                    {isHighMatch ? (
                                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            <ShieldCheck className="h-3 w-3" />
                                            High Match
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            <AlertTriangle className="h-3 w-3" />
                                            Possible Match
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        Match: {Math.round(displayScore * 100)}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    New Listing
                                </span>
                            )}
                        </div>

                        <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            View Details
                        </span>
                    </div>

                    {/* Trust Score Indicator */}
                    {listing.metadata.trust_score !== undefined && (
                        <div className="flex flex-col gap-1 rounded-md bg-muted/50 p-2 text-xs">
                            <div className="flex items-center gap-2">
                                {listing.metadata.trust_score > 0.8 ? (
                                    <ShieldCheck className="h-3 w-3 text-green-600" />
                                ) : listing.metadata.trust_score > 0.5 ? (
                                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                ) : (
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                )}
                                <span className={`font-medium ${listing.metadata.trust_score > 0.8 ? 'text-green-600' :
                                    listing.metadata.trust_score > 0.5 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    Trust Score: {Math.round(listing.metadata.trust_score * 100)}%
                                </span>
                            </div>
                            <p className="text-muted-foreground">
                                {listing.metadata.trust_reason}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
