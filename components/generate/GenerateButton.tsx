"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

type GenerateButtonProps = {
  loading: boolean;
  onClick: () => void;
};

const loadingMessages = [
  "韻を探しています...",
  "リズムを刻んでいます...",
  "笑いをブレンド中...",
  "あと少しで完成です...",
];

export default function GenerateButton({
  loading,
  onClick,
}: GenerateButtonProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => {
    if (!loading) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 600);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-2xl
        py-4
        text-lg
        font-semibold
        text-white
        shadow-md
        transition-all
        duration-200

        ${
          loading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-[#891630] hover:bg-[#7A1A21] active:scale-[0.98]"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 size={22} className="animate-spin" />
          <span>{loadingMessages[messageIndex]}</span>
        </>
      ) : (
        <>
          <Sparkles size={22} />
          この内容で一首を生成する
        </>
      )}
    </button>
  );
}