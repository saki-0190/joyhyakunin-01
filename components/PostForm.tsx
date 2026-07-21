"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAuthorizationHeader, getStoredUser } from "@/lib/auth";

export default function PostForm() {
    const router = useRouter();
    const [poemText, setPoemText] = useState("");
    const [theme, setTheme] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = getStoredUser();
        const authHeader = getAuthorizationHeader();
        if (!user || !authHeader.Authorization) {
            router.push("/login");
            return;
        }

        setLoading(true);
        setMessage(null);

        const payload = {
            poem_text: poemText,
            theme: theme,
            image_url: imageUrl,
        };

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("投稿に失敗しました");
            }

            setMessage({ type: "success", text: "投稿しました！" });
            setPoemText("");
            setTheme("");
            setImageUrl("");
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "投稿に失敗しました" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold">投稿フォーム</h2>

            <div>
                <label className="block mb-1">本文</label>
                <textarea
                    className="w-full border p-2 rounded"
                    value={poemText}
                    onChange={(e) => setPoemText(e.target.value)}
                />
            </div>

            <div>
                <label className="block mb-1">テーマ</label>
                <input
                    className="w-full border p-2 rounded"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                />
            </div>

            <div>
                <label className="block mb-1">画像URL</label>
                <input
                    className="w-full border p-2 rounded"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                {loading ? "投稿中..." : "投稿する"}
            </button>

            {message && (
                <p className={message.type === "error" ? "text-sm text-red-600" : "text-sm text-green-700"}>
                    {message.text}
                </p>
            )}
        </form>
    );
}
