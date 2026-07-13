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
      department: "営業部",
      industry: "製造業",
      time: "3時間前",
      likes: 24,
      poem: `資料作り
徹夜で仕上げ

送信後
誤字に気づいて

おはようございます`,
    },
    {
      id: 2,
      user: "山田",
      department: "企画部",
      industry: "IT",
      time: "昨日",
      likes: 41,
      poem: `オンライン
マイクオフのまま

話し続け
全員無音で

聞こえてますか`,
    },
    {
      id: 3,
      user: "佐藤",
      department: "人事部",
      industry: "金融",
      time: "2日前",
      likes: 18,
      poem: `資料できた
安心したら

添付忘れ
送信ボタンで

心が止まる`,
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">

        <div className="mx-auto max-w-xl px-4 py-6">

          {/* タイトル */}
          <div className="mb-6 text-center">

            <h1 className="text-3xl font-bold text-gray-800">
              ビジネス百人一首
            </h1>

            <p className="mt-2 text-gray-500">
              みんなの「あるある」を楽しもう
            </p>

          </div>

          {/* タブ */}
          <FeedTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* 投稿ボタン */}
          <div className="mb-6">
            <Button text="🎤 ＋ 一首を詠む" />
          </div>

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
                department={post.department}
                industry={post.industry}
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