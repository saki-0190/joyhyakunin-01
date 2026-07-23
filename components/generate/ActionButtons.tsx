import { Download, Send } from "lucide-react";

type ActionButtonsProps = {
  onPost: () => void | Promise<void>;
  onSaveImage: () => void | Promise<void>;
  posting?: boolean;
  savingImage?: boolean;
};

export default function ActionButtons({
  onPost,
  onSaveImage,
  posting = false,
  savingImage = false,
}: ActionButtonsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        onClick={onSaveImage}
        disabled={savingImage}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-[#891630]
          bg-white
          py-4
          font-semibold
          text-[#891630]
          transition
          hover:bg-[#fff6f8]
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        <Download size={20} />
        {savingImage ? "保存中..." : "画像で保存"}
      </button>

      <button
        onClick={onPost}
        disabled={posting}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-[#891630]
          py-4
          font-semibold
          text-white
          transition
          hover:bg-[#7A1A21]
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        <Send size={20} />
        {posting ? "投稿中..." : "投稿"}
      </button>
    </div>
  );
}
