import React, { useRef, useEffect } from "react";
import UserMessageBubble from "./UserMessageBubble";
import AIMessageBlock from "./AIMessageBlock";
import LoadingIndicator from "./LoadingIndicator";

export type ChatMessage = {
    id: string;
    role: "user" | "ai";
    content: string;
    isTyping?: boolean;
};

interface ChatHistoryProps {
    messages: ChatMessage[];
    isAwaitingResponse?: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isAwaitingResponse }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isAwaitingResponse]);

    return (
        <div
            ref={scrollRef}
            className={`
                flex-1 overflow-y-auto px-4 py-6
                bg-white/5 backdrop-blur-sm
                space-y-2
                scrollbar-thin scrollbar-thumb-cyan-700/40 scrollbar-track-transparent
                transition-all
            `}
            style={{
                minHeight: 0,
            }}
        >
            {messages.map((msg) =>
                msg.role === "user" ? (
                    <UserMessageBubble key={msg.id} content={msg.content} />
                ) : (
                    <AIMessageBlock key={msg.id} content={msg.content} />
                )
            )}
            {isAwaitingResponse && <LoadingIndicator />}
        </div>
    );
};

export default ChatHistory;