import React, { useState } from "react";
import { SendHorizonal } from "lucide-react"; // Example icons

const ChatInput: React.FC<{ onSend?: (msg: string) => void }> = ({ onSend }) => {
    const [input, setInput] = useState("");
    
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
        className={`
        w-full px-4 py-3
        bg-white/5 backdrop-blur-md
        border-t border-white/10
        flex items-center gap-2
        rounded-b-2xl
        shadow-inner
        z-20
      `}
            style={{
                boxShadow: "0 2px 16px 0 rgba(0,255,255,0.08)",
            }}
            >
            {/* Optional: Quick action button */}
            {/* <button
                type="button"
                className="p-2 rounded-lg bg-gradient-to-br from-cyan-700/60 to-purple-700/60 hover:from-cyan-500 hover:to-purple-500 transition-all shadow-md"
                title="Summarize"
                tabIndex={-1}
                >
                <Sparkles className="w-5 h-5 text-cyan-200" />
                </button> */}
                {/* Input */}
                <input
                type="text"
                className={`
          flex-1 px-4 py-2 rounded-xl
          bg-white/10 text-white
          border border-cyan-400/20
          focus:outline-none focus:ring-2 focus:ring-cyan-400/60
          placeholder:text-cyan-200/60
          font-sans
          transition-all
          shadow-sm
        `}
                    style={{
                        backdropFilter: "blur(2px)",
                    }}
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoComplete="off"
                    />
                    
                    {/* Voice input (optional) */}
                    {/* <button
                        type="button"
                        className="p-2 rounded-lg bg-gradient-to-br from-cyan-700/60 to-purple-700/60 hover:from-cyan-500 hover:to-purple-500 transition-all shadow-md"
                        title="Voice input"
                        tabIndex={-1}
                        >
                        <Mic className="w-5 h-5 text-cyan-200" />
                        </button> */}
                        
                        {/* Send button */}
                        <button
                        type="submit"
                        className={`
          p-2 rounded-lg
          bg-gradient-to-br from-cyan-500 to-blue-600
          hover:from-cyan-400 hover:to-blue-500
          shadow-lg
          transition-all
          disabled:opacity-50
        `}
                            disabled={!input.trim()}
                            title="Send"
                            >
                            <SendHorizonal className="w-5 h-5 text-white" />
                            </button>
                            </form>
                        );
                    };
                    
                    export default ChatInput;