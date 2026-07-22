"use client";

import { useEffect, useState } from "react";

import Header from "@/components/Header";
import ProfileCard from "@/components/mypage/ProfileCard";
import ProfileStats from "@/components/mypage/ProfileStats";
import MyPoemCard from "@/components/mypage/MyPoemCard";
import { useRouter } from "next/navigation";

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

function parseUtcDate(value: string) {
  return new Date(/([zZ]|[+\-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`);
}

function formatCreatedAt(createdAt: string, nowMs: number) {
  const date = parseUtcDate(createdAt);
  const diffMs = nowMs - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffHours < 48) return "昨日";

  return `${Math.floor(diffHours / 24)}日前`;
}

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; email: string; nickname: string } | null>(null);
  const [tab, setTab] = useState<TabType>("myPoems");
  const [data, setData] = useState<MypageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // ログイン情報を読み込む
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login"); // 未ログインならログインページへ
    }
  }, []);

  // 時刻更新
   useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  // マイページデータ取得
  useEffect(() => {
    const fetchMypage = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!user) return;
        const res = await fetch(`/api/mypage/${user.id}`);
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
  }, [user]);

  const myPoems = data?.my_posts ?? [];
  const likedByOthers = data?.my_likes_received ?? [];
  const likedPoems = data?.my_likes_given ?? [];

  const currentList =
    tab === "myPoems"
      ? myPoems.map((post) => {
        const label = formatCreatedAt(post.created_at, now);
        return {
          id: post.post_id,
          poem: post.poem_text,
          time: label,
          date: label,
          likes: post.likes_count,
        };
      })
      : tab === "likesReceived"
        ? likedByOthers.map((item) => {
          const label = formatCreatedAt(item.created_at, now);
          return {
            id: item.like_id,
            poem: item.post.poem_text,
            time: label,
            date: label,
            likes: item.post.likes_count,
          };
        })
        : likedPoems.map((item) => {
          const label = formatCreatedAt(item.created_at, now);
          return {
            id: item.like_id,
            poem: item.post.poem_text,
            time: label,
            date: label,
            likes: item.post.likes_count,
          };
        });

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
            name={user?.nickname ?? "ゲスト"}
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
                  time={poem.date}
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
