import React, { useState } from "react";

const LlmQueryBox: React.FC = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);
        
        // TODO: Replace this with your actual LLM API call
        // Simulate async response
        setTimeout(() => {
            setResponse(`LLM response for: "${query}"`);
            setLoading(false);
        }, 1000);
    };
    
    return (
        <div className="p-4 bg-white rounded shadow">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1"
                    placeholder="Enter your query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    disabled={loading || !query.trim()}
                    >
                    {loading ? "Loading..." : "Send"}
                </button>
            </form>
            <div className="mt-4 min-h-[2rem]">
                {response && (
                    <div className="p-2 bg-gray-100 rounded">{response}</div>
                )}
            </div>
        </div>
    );
};

export default LlmQueryBox;