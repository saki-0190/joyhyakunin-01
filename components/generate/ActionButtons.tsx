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
          gap-2
          rounded-xl
          border-2
          border-[#601419]
          bg-white
          py-3
          font-semibold
          text-[#601419]
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
          gap-2
          rounded-xl
          bg-[#601419]
          py-3
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