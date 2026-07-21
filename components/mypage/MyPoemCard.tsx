"use client";

import {
  Download,
  Trash2,
  ThumbsUp,
} from "lucide-react";

import PoemCard from "@/components/common/PoemCard";

type MyPoemCardProps = {
  poem: string;
  date: string;
  likes: number;

  onDownload: () => void;
  onEdit?: () => void;
  onDelete: () => void;
};

export default function MyPoemCard({
  poem,
  date,
  likes,
  onDownload,
  onEdit,
  onDelete,
}: MyPoemCardProps) {
  return (
    <div className="bg-white p-2">

      {/* 日付・いいね */}
      <div className="pb-4 flex items-center justify-between">

        <span className="text-sm text-[#7F7F7F]">
          {date}
        </span>

        <div className="flex items-center gap-2 text-[#7F7F7F]">

          <ThumbsUp size={16} />

          <span className="text-sm">
            {likes}
          </span>

        </div>

      </div>

      {/* 歌札 */}
      <div className="flex justify-center">
        <PoemCard poem={poem} />
      </div>

      {/* ボタン */}
      <div className="grid grid-cols-2 gap-3 py-6 px-5">

        <button
          onClick={onDownload}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border-2
            border-[#891630]
            bg-white
            py-3
            text-sm
            font-semibold
            text-[#891630]
            transition
            hover:bg-[#FFF6F7]
          "
        >
          <Download size={16} />
          保存
        </button>

        <button
          onClick={onDelete}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#891630]
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#741225]
          "
        >
          <Trash2 size={16} />
          削除
        </button>

      </div>

    </div>
  );
}