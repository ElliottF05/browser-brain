import React from "react";

interface UserMessageBubbleProps {
    content: string;
}

const UserMessageBubble: React.FC<UserMessageBubbleProps> = ({ content }) => (
    <div className="w-full flex justify-end my-2">
        <div
            className={`
                max-w-[80%] px-4 py-2
                rounded-t-xl rounded-bl-xl
                rounded-br-sm
                bg-[var(--bb-user-bg-gradient)]
                text-white font-semibold
                text-[12px]
                break-words
                whitespace-pre-wrap
                font-sans
                transition-all
                shadow-none
            `}
            style={{
                background: "linear-gradient(100deg, #1e293b 0%, #3b82f6 100%)"
            }}
        >
            {content}
        </div>
    </div>
);

export default UserMessageBubble;