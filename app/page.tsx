"use client";

import { useState } from "react";

import Header from "@/components/Header";
import Button from "@/components/Button";

import FeedCard from "@/components/feed/FeedCard";
import FeedTabs from "@/components/feed/FeedTabs";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<
    "popular" | "latest"
  >("popular");

  const posts = [
    {
      id: 1,
      user: "田中",
      time: "3時間前",
      likes: 24,
      poem: `上司の指示で　困惑
       運動会では　トンカツ`,
    },
    {
      id: 2,
      user: "山田",
      time: "昨日",
      likes: 41,
      poem: `気づけば定時　山積み
       アマゾン奥地　カナヅチ`,
    },
    {
      id: 3,
      user: "佐藤",
      time: "2日前",
      likes: 18,
      poem: `意見募るも　だんまり
       ペンギン正座　歯ぎしり`,
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#FDFBF7] pb-24">

        <div className="mx-auto max-w-xl px-4 py-6">

          {/* タイトル */}
          <div className="mb-6 text-center">

            <h1 className="text-xl font-bold text-gray-800">
              みんなの「あるある」を楽しもう
            </h1>

          </div>

          {/* タブ */}
          <FeedTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* 説明 */}
          <p className="mb-8 text-center text-sm text-gray-400">
            ※投稿内容は個人の創作・発言です
          </p>

          {/* 投稿一覧 */}
          <div className="space-y-6">

            {posts.map((post) => (
              <FeedCard
                key={post.id}
                user={post.user}
                time={post.time}
                poem={post.poem}
                likes={post.likes}
              />
            ))}

          </div>

        </div>

      </main>
    </>
  );
}