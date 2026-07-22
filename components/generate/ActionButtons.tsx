import { Send } from "lucide-react";

type ActionButtonsProps = {
  onPost: () => void;
};

export default function ActionButtons({
  onPost,
}: ActionButtonsProps) {
  return (
    <div className="mt-6">
      <button
        onClick={onPost}
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
        "
      >
        <Send size={20} />
        投稿
      </button>
    </div>
  );
}
