import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatHistory, { type ChatMessage } from "./ChatHistory";
import ChatInput from "./ChatInput";

const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

    const handleSend = async (msg: string) => {
        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "user", content: msg },
        ]);
        setIsAwaitingResponse(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/chat/query/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: msg,
                    user_id: "user123"
                })
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let result = "";
            let aiMessageId = crypto.randomUUID();

            let firstChunk = true;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });

                if (firstChunk) {
                    setIsAwaitingResponse(false);
                    setMessages((prev) => [
                        ...prev,
                        { id: aiMessageId, role: "ai", content: result }
                    ]);
                    firstChunk = false;
                } else {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === aiMessageId
                                ? { ...m, content: result }
                                : m
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setIsAwaitingResponse(false);
        }
    };

    return (
        <div
            className={`
                relative w-full h-full flex flex-col
                rounded-2xl
                shadow-bb-card
                bg-gradient-to-br from-bb-bg via-[#232946] to-[#1a1a2e]
                backdrop-blur-md
                border border-[var(--bb-accent)]/5
                overflow-hidden
                font-sans
                min-h-[400px] min-w-[300px]
            `}
            style={{
                boxShadow:
                    "0 4px 32px 0 #ffb30022, 0 1.5px 8px 0 rgba(0,0,0,0.25)",
            }}
        >
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 80% 0%, #ffb30022 0%, transparent 70%), radial-gradient(ellipse at 20% 100%, #ff512f22 0%, transparent 70%)",
                    filter: "blur(8px)",
                }}
            />
            <div className="relative z-10 flex flex-col h-full flex-1">
                {/* <ChatHeader /> */}
                <ChatHistory messages={messages} isAwaitingResponse={isAwaitingResponse} />
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
};

export default ChatApp;