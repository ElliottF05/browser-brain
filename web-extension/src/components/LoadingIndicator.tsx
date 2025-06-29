import React from "react";
import { Loader2 } from "lucide-react";

const LoadingIndicator: React.FC = () => (
    <div className="w-full flex justify-center my-2">
        <div
            className={`
                flex items-center gap-2 px-4 py-1 rounded-lg
                bg-cyan-900/30
                border border-cyan-400/10
                backdrop-blur-sm
                shadow
                animate-fadein
            `}
        >
            <Loader2 className="w-4 h-4 text-cyan-300 animate-spin" />
            <span className="text-cyan-200 text-xs font-mono opacity-70">
                Awaiting response…
            </span>
        </div>
    </div>
);

export default LoadingIndicator;