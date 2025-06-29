import React from "react";
import { Loader2 } from "lucide-react";

const LoadingIndicator: React.FC = () => (
    <div className="w-full flex justify-center my-2">
        <div
            className={`
                flex items-center gap-2 px-4 py-1 rounded-lg
                bg-[var(--bb-bg-glass)]
                border border-[var(--bb-accent)]/20
                backdrop-blur-sm
                shadow-bb-glow
                animate-fadein
            `}
        >
            <Loader2 className="w-4 h-4 text-[var(--bb-accent)] animate-spin" />
            <span className="text-[var(--bb-accent)] text-xs font-mono opacity-80">
                Awaiting response…
            </span>
        </div>
    </div>
);

export default LoadingIndicator;