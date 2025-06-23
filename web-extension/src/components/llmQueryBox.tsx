import React, { use, useState } from "react";

const LlmQueryBox: React.FC = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);
        
        try {
            const res = await fetch("http://127.0.0.1:8000/chat/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    content: query,
                    user_id: "user123" // TODO: replace with actual user ID
                })
            });
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
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