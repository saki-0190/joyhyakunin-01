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
      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 transition
      ${
        liked
          ? "border-[#891630] bg-[#FBEBEC] text-[#891630]"
          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
      }`}
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