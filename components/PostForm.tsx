"use client";

import { useState, type FormEvent } from "react";

export default function PostForm() {
    const [poemText, setPoemText] = useState("");
    const [theme, setTheme] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [userId] = useState(1); // 仮のユーザーID

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            user_id: userId,
            poem_text: poemText,
            theme: theme,
            image_url: imageUrl,
        };

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("投稿に失敗しました");
            }

            alert("投稿しました！");
            setPoemText("");
            setTheme("");
            setImageUrl("");
        } catch (error) {
            console.error(error);
            alert("投稿に失敗しました");
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
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                投稿する
            </button>
        </form>
    );
}
