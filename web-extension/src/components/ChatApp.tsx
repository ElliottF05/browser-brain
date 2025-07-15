import React, { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { BASE_URL, CHAT_HISTORY_UPDATE, CHAT_MESSAGE_RECEIVED, REQUEST_CHAT_HISTORY, type ChatMessage } from "@/types";

const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

    useEffect(() => {
        // listen to chat history update events
        function handleChatHistoryUpdate(message: any) {
            if (message.type === CHAT_HISTORY_UPDATE) {
                setMessages(message.messages);
            }
        }
        chrome.runtime.onMessage.addListener(handleChatHistoryUpdate);

        // request initial chat history from background
        chrome.runtime.sendMessage({ type: REQUEST_CHAT_HISTORY }, (response) => {
            if (response && response.messages) {
                setMessages(response.messages);
            }
        });

        return () => {
            chrome.runtime.onMessage.removeListener(handleChatHistoryUpdate);
        };
    }, []);

    const handleSend = async (msg: string) => {

        const userMessage: ChatMessage = {
            role: "user",
            content: msg,
            isTyping: false
        };

        setMessages((prev) => [
            ...prev,
            userMessage
        ]);
        setIsAwaitingResponse(true);

        chrome.runtime.sendMessage({
            type: CHAT_MESSAGE_RECEIVED,
            message: userMessage
        });

        try {
            const res = await fetch(`${BASE_URL}/chat/query/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: msg
                })
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            let firstChunk = true;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });

                if (firstChunk) {
                    setIsAwaitingResponse(false);
                    setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: result }
                    ]);
                    firstChunk = false;
                } else {
                    setMessages((prev) =>
                        prev.map((m,i) =>
                            i === prev.length - 1 ? { ...m, content: result } : m
                        )
                    );
                }
            }

            const aiMessage: ChatMessage = {
                role: "assistant",
                content: result,
                isTyping: false
            };
            chrome.runtime.sendMessage({
                type: CHAT_MESSAGE_RECEIVED,
                message: aiMessage
            });

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
                overflow-hidden
                font-sans
                min-h-[400px] min-w-[300px]
                bg-transparent
            `}
        >
            <div className="relative z-10 flex flex-col h-full flex-1">
                {/* <ChatHeader /> */}
                <ChatHistory messages={messages} isAwaitingResponse={isAwaitingResponse} />
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
};

export default ChatApp;