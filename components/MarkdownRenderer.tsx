import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
            <ReactMarkdown
                components={{
                    a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
