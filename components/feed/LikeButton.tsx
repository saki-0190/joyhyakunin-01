"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import { getAuthorizationHeader, getStoredUser } from "@/lib/auth";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
  initialLiked?: boolean;
  onStateChange?: (next: { liked: boolean; likes: number }) => void;
};

type ToggleLikeResponse = {
  liked?: boolean;
  likes_count?: number;
};

export default function LikeButton({
  postId,
  initialLikes,
  initialLiked = false,
  onStateChange,
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    if (processing) return;

    const user = getStoredUser();
    const authHeader = getAuthorizationHeader();
    if (!user || !authHeader.Authorization) {
      router.push("/login");
      return;
    }

    setProcessing(true);
    const previousLiked = liked;
    const previousLikes = likes;
    const nextLiked = !liked;
    const nextLikes = Math.max(0, likes + (nextLiked ? 1 : -1));
    setLikes(nextLikes);
    setLiked(nextLiked);
    onStateChange?.({ liked: nextLiked, likes: nextLikes });

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

      const payload = (await res.json().catch(() => ({}))) as ToggleLikeResponse;
      const confirmedLiked = typeof payload.liked === "boolean" ? payload.liked : nextLiked;
      const confirmedLikes =
        typeof payload.likes_count === "number" ? payload.likes_count : nextLikes;

      setLiked(confirmedLiked);
      setLikes(confirmedLikes);
      onStateChange?.({ liked: confirmedLiked, likes: confirmedLikes });
    } catch (error) {
      console.error(error);
      setLikes(previousLikes);
      setLiked(previousLiked);
      onStateChange?.({ liked: previousLiked, likes: previousLikes });
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
