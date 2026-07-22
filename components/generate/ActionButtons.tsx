import { Download, Send } from "lucide-react";

type ActionButtonsProps = {
  onSave: () => void;
  onPost: () => void;
};

export default function ActionButtons({
  onSave,
  onPost,
}: ActionButtonsProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">

      <button
        onClick={onSave}
        className="
          flex
          items-center
          justify-center
          gap-1
          rounded-lg
          border-2
          border-[#891630]
          bg-white
          px-4
          py-0
          font-medium
          text-[#891630]
          transition
          hover:bg-[#FFF5F5]
        "
      >
        <Download size={20} />
        保存
      </button>

      <button
        onClick={onPost}
        className="
          flex
          items-center
          justify-center
          gap-1
          rounded-lg
          bg-[#891630]
          py-4
          py-0
          font-semibold
          text-white
          transition
          hover:bg-[#7A1A21]
        "
      >
        <Send size={20} />
        投稿
      </button>

    </div>
  );
}