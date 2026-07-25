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
          className="h-12 w-12 rounded-full border-2 border-[#F6E5EA] object-cover"
        />

        <div>
          <h3 className="font-bold text-gray-800">
            {user}
          </h3>

          <p className="text-sm text-gray-400">
            {time}
          </p>
        </div>

      </div>

      {/* 一首 */}
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

          <pre className="whitespace-pre-wrap font-sans text-lg leading-9">
           {poem}
          </pre>
        </div>
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