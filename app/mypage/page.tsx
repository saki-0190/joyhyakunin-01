"use client";

import { useEffect, useState } from "react";

import Header from "@/components/Header";
import ProfileCard from "@/components/mypage/ProfileCard";
import ProfileStats from "@/components/mypage/ProfileStats";
import MyPoemCard from "@/components/mypage/MyPoemCard";

type TabType = "myPoems" | "likesReceived" | "likesGiven";

type PostItem = {
  post_id: number;
  user_id: number;
  poem_text: string;
  theme: string;
  image_url: string;
  likes_count: number;
  created_at: string;
};

type LikeItem = {
  like_id: number;
  post: PostItem;
  created_at: string;
  liked_by_user_id?: number;
};

type MypageResponse = {
  my_posts: PostItem[];
  my_likes_given: LikeItem[];
  my_likes_received: LikeItem[];
};

const USER_ID = 1;
const USER_NAME = "たなかっち";

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "たった今";
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffHours < 48) return "昨日";

  return `${Math.floor(diffHours / 24)}日前`;
}

export default function MyPage() {
  const [tab, setTab] = useState<TabType>("myPoems");
  const [data, setData] = useState<MypageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMypage = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/mypage/${USER_ID}`);
        if (!res.ok) {
          throw new Error("マイページ情報の取得に失敗しました");
        }

        const json = (await res.json()) as MypageResponse;
        setData(json);
      } catch (err) {
        console.error(err);
        setError("データを取得できませんでした。しばらくしてから再度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    fetchMypage();
  }, []);

  const myPoems = data?.my_posts ?? [];
  const likedByOthers = data?.my_likes_received ?? [];
  const likedPoems = data?.my_likes_given ?? [];

  const currentList =
    tab === "myPoems"
      ? myPoems.map((post) => ({
        id: post.post_id,
        poem: post.poem_text,
        date: formatCreatedAt(post.created_at),
        likes: post.likes_count,
      }))
      : tab === "likesReceived"
        ? likedByOthers.map((item) => ({
          id: item.like_id,
          poem: item.post.poem_text,
          date: formatCreatedAt(item.created_at),
          likes: item.post.likes_count,
        }))
        : likedPoems.map((item) => ({
          id: item.like_id,
          poem: item.post.poem_text,
          date: formatCreatedAt(item.created_at),
          likes: item.post.likes_count,
        }));

  const title =
    tab === "myPoems"
      ? "詠んだ首"
      : tab === "likesReceived"
        ? "わかる！された首"
        : "わかる！した首";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-4 py-6">

          <ProfileCard
            name={USER_NAME}
            image="/images/profile/profile01.png"
            onEdit={() => alert("プロフィール編集")}
          />

          <ProfileStats
            poemCount={myPoems.length}
            likesReceived={likedByOthers.length}
            likesGiven={likedPoems.length}
            selected={tab}
            onChange={setTab}
          />

          <div className="mt-8 mb-4">
            <h2 className="text-2xl font-bold text-[#601419]">
              {title}
            </h2>
            <p className="text-sm text-gray-500">{title}一覧</p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
                マイページを読み込み中です...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-6 text-center text-red-500 shadow-sm">
                {error}
              </div>
            ) : currentList.length > 0 ? (
              currentList.map((poem) => (
                <MyPoemCard
                  key={poem.id}
                  poem={poem.poem}
                  date={poem.date}
                  likes={poem.likes}
                  onDownload={() => alert("保存")}
                  onDelete={() => alert("削除")}
                />
              ))
            ) : (
              <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
                表示する投稿がありません。
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
