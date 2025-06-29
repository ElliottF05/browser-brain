import React from "react";
import { Card } from "@/components/ui/card"; // ShadCN Card

interface UserMessageBubbleProps {
    content: string;
}

const UserMessageBubble: React.FC<UserMessageBubbleProps> = ({ content }) => (
    <div className="w-full flex justify-end my-2">
        <Card
        className={`
            max-w-[80%] px-4 py-2 rounded-xl
            bg-gradient-to-br from-cyan-600 to-blue-700
            text-white font-semibold
            border border-cyan-400/30
            shadow-lg
            text-sm
            animate-glow
            break-words
            whitespace-pre-wrap
            font-sans
        `}
            >
            {content}
        </Card>
    </div>
);
    
    export default UserMessageBubble;