"use client";

import { useState } from "react";

import Header from "@/components/Header";
import ProfileCard from "@/components/mypage/ProfileCard";
import ProfileStats from "@/components/mypage/ProfileStats";
import MyPoemCard from "@/components/mypage/MyPoemCard";

type TabType = "myPoems" | "likesReceived" | "likesGiven";

export default function MyPage() {
  const [tab, setTab] = useState<TabType>("myPoems");

  // 自分が詠んだ歌
  const myPoems = [
    {
      id: 1,
      poem: `上司に　困惑
運動会では　トンカツ`,
      date: "2025年6月12日",
      likes: 24,
    },
    {
      id: 2,
      poem: `気づけば定時　山積み
アマゾン奥地　カナヅチ`,
      date: "2025年3月31日",
      likes: 82,
    },
  ];

  // わかる！された歌
  const likedByOthers = [
    {
      id: 3,
      poem: `朝の電車　遅延
土偶が語る　地縁`,
      date: "2025年5月20日",
      likes: 115,
    },
  ];

  // 自分がわかる！した歌
  const likedPoems = [
    {
      id: 4,
      poem: `意見募るも　だんまり
ペンギン正座　歯ぎしり`,
      date: "2025年4月18日",
      likes: 36,
    },
  ];

  const currentList =
    tab === "myPoems"
      ? myPoems
      : tab === "likesReceived"
      ? likedByOthers
      : likedPoems;

  const title =
    tab === "myPoems"
      ? "詠んだ首"
      : tab === "likesReceived"
      ? "わかる！された首"
      : "わかる！した首";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-4 py-6">

          <ProfileCard
            name="たなかっち"
            image="/images/profile/profile01.png"
            onEdit={() => alert("プロフィール編集")}
          />

          <ProfileStats
            poemCount={12}
            likesReceived={147}
            likesGiven={23}
            selected={tab}
            onChange={setTab}
          />

          {/* タイトル */}
          <div className="mt-8 mb-4">

            <h2 className="text-2xl font-bold text-[#601419]">
              {title}
            </h2>

            <p className="text-sm text-gray-500">
              {title}一覧
            </p>

          </div>

          {/* 一覧 */}
          <div className="space-y-6">

            {currentList.map((poem) => (
              <MyPoemCard
                key={poem.id}
                poem={poem.poem}
                date={poem.date}
                likes={poem.likes}
                onDownload={() => alert("保存")}
                onDelete={() => alert("削除")}
              />
            ))}

          </div>

        </div>
      </main>
    </>
  );
}