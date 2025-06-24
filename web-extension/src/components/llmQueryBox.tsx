import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LlmQueryBox: React.FC = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const res = await fetch("http://127.0.0.1:8000/chat/query/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: query,
                    user_id: "user123" // TODO: replace with actual user ID
                })
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
                setResponse(result); // update as new data arrives
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter your query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    disabled={loading || !query.trim()}
                >
                    {loading ? "Loading..." : "Send"}
                </Button>
            </form>
            <CardContent className="mt-4 min-h-[2rem]">
                {response && (
                    <div className="p-2 bg-gray-100 rounded">
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LlmQueryBox;