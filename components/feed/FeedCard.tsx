import LikeButton from "./LikeButton";
import Image from "next/image";

type FeedCardProps = {
  postId: number;
  user: string;
  userImage: string;
  time: string;
  poem: string;
  likes: number;
};

export default function FeedCard({
  postId,
  user,
  userImage,
  time,
  poem,
  likes,
}: FeedCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

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
      <div
        className="
    rounded-2xl
    bg-[#F2F2F2]
    border-2
    border-[#D9C7A1]
    shadow-md
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
        <LikeButton postId={postId} initialLikes={likes} />
      </div>

    </div>
  );
}