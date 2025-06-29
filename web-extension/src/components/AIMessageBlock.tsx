import React from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card"; // ShadCN Card

interface AIMessageBlockProps {
    content: string;
    isTyping?: boolean;
}

const AIMessageBlock: React.FC<AIMessageBlockProps> = ({ content }) => (
    <div className="w-full flex flex-col items-start my-2">
        <Card
            className={`
                w-full px-4 py-3 rounded-xl
                bg-[var(--bb-glass)]
                border border-[var(--bb-accent)]/10
                backdrop-blur-md
                shadow-bb-card
                text-white
                font-sans
                text-sm
                animate-fadein
                break-words
                whitespace-pre-wrap
            `}
        >
            <ReactMarkdown
                components={{
                    code: ({ children, className, ...props }) =>
                        className ? (
                            // Code block
                            <pre className="bg-[#232946] p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono text-[var(--bb-accent)]">
                                <code className={className} {...props}>{children}</code>
                            </pre>
                        ) : (
                            // Inline code
                            <code
                                className="bg-[var(--bb-glass)] text-[var(--bb-accent)] px-1 py-0.5 rounded font-mono text-xs"
                                {...props}
                            >
                                {children}
                            </code>
                        ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Card>
    </div>
);

export default AIMessageBlock;