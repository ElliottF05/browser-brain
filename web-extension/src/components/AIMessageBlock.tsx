import React from "react";
import ReactMarkdown from "react-markdown";

interface AIMessageBlockProps {
    content: string;
    isTyping?: boolean;
}

const AIMessageBlock: React.FC<AIMessageBlockProps> = ({ content }) => (
    <div className="w-full flex flex-col items-start my-2 text-[12px]">
        <ReactMarkdown
            components={{
                a: ({ href, children, ...props }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                        className="text-[var(--bb-blue-accent)] underline"
                    >
                        {children}
                    </a>
                ),
                code: ({ children, className, ...props }) =>
                    className ? (
                        <pre className="bg-[#232946] p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono text-[var(--bb-blue-accent)]">
                            <code className={className} {...props}>{children}</code>
                        </pre>
                    ) : (
                        <code
                            className="bg-[#232946] text-[var(--bb-blue-accent)] px-1 py-0.5 rounded font-mono text-xs"
                            {...props}
                        >
                            {children}
                        </code>
                    ),
            }}
        >
            {content}
        </ReactMarkdown>
    </div>
);

export default AIMessageBlock;