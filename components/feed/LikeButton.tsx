"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import { getAuthorizationHeader, getStoredUser } from "@/lib/auth";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
};

export default function LikeButton({
  postId,
  initialLikes,
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [processing, setProcessing] = useState(false);

  const handleLike = async () => {
    if (processing) return;

    const user = getStoredUser();
    const authHeader = getAuthorizationHeader();
    if (!user || !authHeader.Authorization) {
      router.push("/login");
      return;
    }

    setProcessing(true);
    const nextLikes = liked ? likes - 1 : likes + 1;
    setLikes(nextLikes);
    setLiked(!liked);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          ...authHeader,
        },
      });
      if (!res.ok) {
        throw new Error("いいね処理に失敗しました");
      }
    } catch (error) {
      console.error(error);
      setLikes(liked ? likes + 1 : likes - 1);
      setLiked(liked);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={processing}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 transition
      ${liked
          ? "border-[#891630] bg-[#FBEBEC] text-[#891630]"
          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
        } ${processing ? "opacity-70" : ""}`}
    >
      <ThumbsUp size={15} />

      <span className="font-medium text-sm ">
        わかる！
      </span>

      <span className="font-bold text-sm">
        {likes}
      </span>
    </button>
  );
}
