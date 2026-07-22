"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

import PoemCard from "./PoemCard";
import Avatar from "./Avatar";

type PoemPostCardProps = {
  postId?: number;
  user: string;
  avatar: string;
  poem: string;
  likes: number;
  isLiked?: boolean; // 👈 状態受け取り用
  date: string;
};

export default function PoemPostCard({
  postId,
  user,
  avatar,
  poem,
  likes,
  isLiked = false,
  date,
}: PoemPostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likes);

  // 💡 いいね押下処理
  const handleLike = async () => {
    // 先に見た目を更新して体感速度を上げる
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => prev + (nextLiked ? 1 : -1));

    if (!postId) return;

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setLikesCount(data.likes_count);
        setLiked(data.is_liked);
      }
    } catch (error) {
      console.error("いいね送信エラー:", error);
      // エラー時は元の状態に戻す
      setLiked(liked);
      setLikesCount(likesCount);
    }
  };

  return (
    <article className="border-b border-[#D9D9D9] bg-[#FFFFFF] p-2 py-4">
      {/* ユーザー */}
      <div className="mb-5 flex items-center gap-4">
        <Avatar src={avatar} alt={user} size={48} />
        <h3 className="text-2xl font-bold text-[#1A1A1A]">{user}</h3>
      </div>

      {/* 歌 */}
      <PoemCard poem={poem} />

      {/* 下部 */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 rounded-lg border-1 px-3 py-1 text-sm font-medium transition-all ${
            liked
              ? "border-[#891630] bg-[#FFF1F3] text-[#891630]"
              : "border-gray-300 bg-white text-[#7F7F7F] hover:bg-gray-50"
          }`}
        >
          <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
          <span>わかる！</span>
          <span>{likesCount}</span>
        </button>

        <span className="text-base text-[#7F7F7F]">{date}</span>
      </div>
    </article>
  );
}