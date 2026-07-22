import { Send } from "lucide-react";

type ActionButtonsProps = {
  onPost: () => void | Promise<void>;
  posting?: boolean;
};

export default function ActionButtons({
  onPost,
  posting = false,
}: ActionButtonsProps) {
  return (
    <div className="mt-6">
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
