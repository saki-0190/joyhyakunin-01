import LikeButton from "./LikeButton";
import Image from "next/image";

type FeedCardProps = {
  postId: number;
  user: string;
  userImage: string;
  time: string;
  poem: string;
  likes: number;
  likedByMe?: boolean;
  onLikeStateChange?: (postId: number, next: { liked: boolean; likes: number }) => void;
};

export default function FeedCard({
  postId,
  user,
  userImage,
  time,
  poem,
  likes,
  likedByMe = false,
  onLikeStateChange,
}: FeedCardProps) {
  return (
    <div className="border border-gray-200 bg-white p-5">

      {/* ユーザー情報 */}
      <div className="mb-4 flex items-start gap-3">

        {/* アイコン */}
        <Image
          src={userImage}
          alt={user}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full border-4 border-[#F6E5EA] object-cover"
        />

        <div>
          <h3 className="font-bold text-[#1A1A1A]">
            {user}
          </h3>

          <p className="text-sm text-gray-500">
            {time}
          </p>
        </div>

      </div>

      {/* 一首 */}
      <div
        className="
          rounded-2xl
          bg-[#FFFDF8]
          border-4
          border-[#D9C7A1]
          p-6
          text-[#3B2F2F]
        "
      >

        <pre className="whitespace-pre-wrap font-sans text-lg leading-9">
          {poem}
        </pre>

      </div>

      {/* わかる */}
      <div className="mt-4">
        <LikeButton
          postId={postId}
          initialLikes={likes}
          initialLiked={likedByMe}
          onStateChange={(next) => onLikeStateChange?.(postId, next)}
        />
      </div>

    </div>
  );
}