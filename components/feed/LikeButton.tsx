"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

type LikeButtonProps = {
  initialLikes: number;
};

export default function LikeButton({
  initialLikes,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition
      ${
        liked
          ? "border-[#601419] bg-[#FBEBEC] text-[#601419]"
          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
      }`}
    >
      <ThumbsUp size={18} />

      <span className="font-medium">
        わかる！
      </span>

      <span className="font-bold">
        {likes}
      </span>
    </button>
  );
}