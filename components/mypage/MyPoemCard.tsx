import Image from "next/image";
import {
  Download,
  Trash2,
  ThumbsUp,
} from "lucide-react";

type MyPoemCardProps = {
  poem: string;
  date: string;
  likes: number;

  user?: string;
  time?: string;
  avatar?: string;
  deleteDisabled?: boolean;
  deleteLoading?: boolean;

  onDownload: () => void;
  onDelete: () => void;
};

export default function MyPoemCard({
  poem,
  date,
  likes,
  user = "たなかっち",
  time = "3時間前",
  avatar = "/images/profile/profile01.png",
  deleteDisabled = false,
  deleteLoading = false,
  onDownload,
  onDelete,
}: MyPoemCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md">

      {/* ユーザー情報 */}
      <div className="flex items-center gap-3 p-4">

        <Image
          src={avatar}
          alt={user}
          width={48}
          height={48}
          className="rounded-full bg-[#F4EEFF] object-cover"
        />

        <div>
          <h3 className="text-xl font-bold text-[#1F2A44]">
            {user}
          </h3>

          <p className="text-sm text-gray-400">
            {time}
          </p>
        </div>

      </div>

      {/* 百人一首カード */}
      <div className="px-4">

        <div
          className="
            rounded-2xl
            border-4
            border-[#D9C7A1]
            bg-[#FFFDF8]
            p-6
          "
        >

          <pre
            className="
              whitespace-pre-wrap
              text-center
              text-xl
              leading-[2]
              font-serif
              text-[#3B2F2F]
            "
          >
            {poem}
          </pre>

        </div>

      </div>

      {/* 日付・いいね */}
      <div className="flex items-center justify-between px-6 py-3">

        <p className="text-base text-gray-500">
          {date}
        </p>

        <div className="flex items-center gap-1 text-gray-500">

          <ThumbsUp size={18} />

          <span className="text-base">
            {likes}
          </span>

        </div>

      </div>

      {/* 区切り線 */}
      <div className="mx-4 border-t border-gray-200" />

      {/* ボタン */}
      <div className="grid grid-cols-2 gap-3 p-4">

        <button
          onClick={onDownload}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#601419]
            bg-white
            py-2
            text-base
            font-semibold
            text-[#601419]
            transition
            hover:bg-[#FFF5F5]
          "
        >
          <Download size={18} />
          保存
        </button>

        <button
          onClick={onDelete}
          disabled={deleteDisabled || deleteLoading}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#601419]
            py-2
            text-base
            font-semibold
            text-white
            transition
            hover:bg-[#7A1A21]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Trash2 size={18} />
          {deleteLoading ? "削除中..." : "削除"}
        </button>

      </div>

    </div>
  );
}