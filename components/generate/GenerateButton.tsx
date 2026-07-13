"use client";

import { Sparkles, Loader2 } from "lucide-react";

type GenerateButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export default function GenerateButton({
  loading,
  onClick,
}: GenerateButtonProps) {
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
            : "bg-[#601419] hover:bg-[#7A1A21] active:scale-[0.98]"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 size={22} className="animate-spin" />
          リズムを刻んでいます...
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