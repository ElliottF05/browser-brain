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
            bg-gradient-to-br from-white/10 to-cyan-900/30
            border border-white/10
            backdrop-blur-md
            shadow-md
            text-cyan-100
            font-sans
            text-sm
            animate-fadein
            break-words
            whitespace-pre-wrap
            glassmorphism
        `}
            >
            <ReactMarkdown
                components={{
                    code: ({ children, ...props }) => (
                        <pre className="bg-cyan-950/70 p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono text-cyan-100">
                            <code {...props}>{children}</code>
                        </pre>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Card>
    </div>
);
    
    export default AIMessageBlock;