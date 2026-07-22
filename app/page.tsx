"use client";

import { useState, useEffect } from "react";

import Header from "@/components/Header";
import FeedCard from "@/components/feed/FeedCard";
import FeedTabs from "@/components/feed/FeedTabs";

type PostItem = {
  post_id: number;
  user_id: number;
  poem_text: string;
  theme: string;
  image_url: string;
  likes_count: number;
  created_at: string;
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"popular" | "latest">("latest");
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/posts?sort=${activeTab}`);
        if (!res.ok) {
          throw new Error("投稿一覧の取得に失敗しました");
        }

        const data = (await res.json()) as PostItem[];

        setPosts(data);
      } catch (error) {
        console.error("投稿取得エラー:", error);
        setError("投稿の読み込みに失敗しました。再読み込みしてください。");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  function parseUtcDate(value: string) {
    return new Date(/([zZ]|[+\-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`);
  }

  function formatTime(createdAt: string, nowMs: number) {
    const date = parseUtcDate(createdAt);
    const diffMs = nowMs - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) return "たった今";
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffHours < 48) return "昨日";

    return `${Math.floor(diffHours / 24)}日前`;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#FDFBF7] pb-24">
        <div className="mx-auto max-w-xl px-4 py-6">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-gray-800">
              みんなの「あるある」を楽しもう
            </h1>
          </div>

          <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

          <p className="mb-8 text-center text-sm text-gray-400">
            ※投稿内容は個人の創作・発言です
          </p>

          <div className="space-y-6">
            {loading ? (
              <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
                投稿を読み込み中です...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-6 text-center text-red-500 shadow-sm">
                {error}
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <FeedCard
                  key={post.post_id}
                  postId={post.post_id}
                  user={`ユーザー${post.user_id}`}
                  time={formatTime(post.created_at, now)}
                  poem={post.poem_text}
                  likes={post.likes_count}
                />
              ))
            ) : (
              <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
                投稿がありません。
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
