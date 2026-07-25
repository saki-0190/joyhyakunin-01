import Image from "next/image";
import { useRef } from "react";
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
  illustration?: string;
  deleteDisabled?: boolean;
  deleteLoading?: boolean;
  downloadLoading?: boolean;

  onDownload: (target: HTMLDivElement | null) => void | Promise<void>;
  onDelete: () => void;
};

export default function MyPoemCard({
  poem,
  date,
  likes,
  user = "たなかっち",
  time = "3時間前",
  avatar = "/images/profile/profile01.png",
  illustration = "/images/characters/character01.png",
  deleteDisabled = false,
  deleteLoading = false,
  downloadLoading = false,
  onDownload,
  onDelete,
}: MyPoemCardProps) {
  const saveCaptureRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="overflow-hidden bg-white shadow-md pt-6 border-t border-[#E5E5E5]">
      <div>
        {/* 百人一首カード */}
        <div className="px-10">

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
              text-lg
              leading-[2]
              font-sans
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

      </div>

      <div className="fixed left-[-10000px] top-0 pointer-events-none" aria-hidden="true">
        <div ref={saveCaptureRef}>
          <div
            className="
              overflow-hidden
              rounded-xl
              border-[20px]
              border-[#385723]
              bg-[#FFFDF8]
              shadow-lg
            "
          >
            <div className="flex flex-col items-center px-8 py-10">
              <pre
                className="
                  mx-auto
                  whitespace-pre-wrap
                  font-serif
                  text-2xl
                  tracking-widest
                  text-[#3B2F2F]
                "
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                  height: "200px",
                  lineHeight: "2.5",
                }}
              >
                {poem}
              </pre>

              <div className="mt-8">
                <Image
                  src={illustration}
                  alt="キャラクター"
                  width={250}
                  height={220}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="grid grid-cols-2 gap-3 px-10 py-4">

        <button
          onClick={() => {
            void onDownload(saveCaptureRef.current);
          }}
          disabled={downloadLoading}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#891630]
            bg-white
            py-2
            text-base
            font-semibold
            text-[#891630]
            transition
            hover:bg-[#FFF5F5]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Download size={18} />
          {downloadLoading ? "保存中..." : "画像で保存"}
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
            bg-[#891630]
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