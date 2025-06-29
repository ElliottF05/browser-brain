import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

const MAX_HEIGHT = 128; // px, about 4 lines

const ChatInput: React.FC<{ onSend?: (msg: string) => void }> = ({ onSend }) => {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, MAX_HEIGHT) + "px";
        }
    }, [input]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim()) {
            onSend?.(input.trim());
            setInput("");
        }
    };

    return (
        <form
            onSubmit={handleSend}
            className="w-full flex justify-center z-20"
            autoComplete="off"
        >
            <div
                className={`
                    relative flex items-end gap-2
                    w-full max-w-xl
                    px-2 py-2
                    mb-4 mx-4
                    rounded-xl
                    bg-gradient-to-r from-[var(--bb-user-gradient-from)]/70 to-[var(--bb-user-gradient-to)]/70
                    border border-white/10
                    focus-within:border-[var(--bb-accent)]/40
                    shadow-bb-glow
                    transition-all
                    overflow-hidden
                `}
                style={{ backdropFilter: "blur(8px)" }}
            >
                {/* Glass overlay for extra subtlety */}
                <span
                    className="absolute inset-0 rounded-xl bg-[var(--bb-bg-glass)] pointer-events-none"
                    style={{ opacity: 0.85 }}
                    aria-hidden="true"
                />
                <textarea
                    ref={textareaRef}
                    className={`
                        relative z-10 flex-1 bg-transparent outline-none border-none resize-none
                        text-white placeholder:text-[var(--bb-accent)]/60
                        px-2 py-1
                        font-sans
                        text-sm
                        max-h-32
                        scrollbar-none
                        transition-all
                        min-h-[40px]
                    `}
                    placeholder="Type your message…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={1}
                    maxLength={1000}
                    style={{
                        overflowY: "auto",
                    }}
                />
                <button
                    type="submit"
                    className={`
                        relative z-10 p-1 rounded-full
                        bg-gradient-to-br from-[var(--bb-accent2)] to-[var(--bb-accent)]
                        hover:from-[var(--bb-accent)] hover:to-[var(--bb-accent2)]
                        shadow-bb-glow
                        transition-all
                        disabled:opacity-50
                    `}
                    disabled={!input.trim()}
                    title="Send"
                >
                    <SendHorizonal className="w-5 h-5 text-white" />
                </button>
            </div>
        </form>
    );
};

export default ChatInput;