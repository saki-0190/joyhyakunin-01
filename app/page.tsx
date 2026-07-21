"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // 💡 ログイン用リンク

import Header from "@/components/Header";
import FeedTabs from "@/components/feed/FeedTabs";
import PoemPostCard from "@/components/common/PoemPostCard";
import Pagination from "@/components/common/Pagination"; 

// バックエンドからの投稿データ型定義
type PostItem = {
  post_id: number;
  user_id: number;
  poem_text: string;
  theme: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  icon?: string;
  is_liked?: boolean;
};

// レスポンスが { items: PostItem[], totalPages: number } の形式で返る場合にも対応できるように型拡張
type ApiResponse = PostItem[] | { items: PostItem[]; totalPages?: number; total_pages?: number };

// アイコンIDから画像パスへの変換マップ
const iconMap: Record<string, string> = {
  "1": "/images/profile/profile01.png",
  "2": "/images/profile/profile02.png",
  "3": "/images/profile/profile03.png",
  "4": "/images/profile/profile04.png",
  "5": "/images/profile/profile05.png",
  "6": "/images/profile/profile06.png",
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"popular" | "latest">("latest");
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // ページネーション用 State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10; // 1ページあたりの件数

  // マイページのプロフィール保持用 State
  const [myProfile, setMyProfile] = useState({
    nickname: "",
    icon: "1",
  });

  // localStorage から自分の最新プロフィールを取得
  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      try {
        setMyProfile(JSON.parse(saved));
      } catch (e) {
        console.error("プロフィール読込エラー:", e);
      }
    }
  }, []);

  // タブが切り替わったら 1 ページ目に戻す
  const handleTabChange = (tab: "popular" | "latest") => {
    setActiveTab(tab);
    setPage(1);
  };

  // 1分ごとに経過時間を更新するためのタイマー
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  // 投稿データの取得 (activeTab または page が変わるたびに再取得)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/posts?sort=${activeTab}&page=${page}&limit=${LIMIT}`);
        if (!res.ok) {
          throw new Error("投稿一覧の取得に失敗しました");
        }

        const data: ApiResponse = await res.json();

        if (Array.isArray(data)) {
          setPosts(data);
          setTotalPages(1);
        } else {
          setPosts(data.items ?? []);
          setTotalPages(data.totalPages ?? data.total_pages ?? 1);
        }
      } catch (error) {
        console.error("投稿取得エラー:", error);
        setError("投稿の読み込みに失敗しました。再読み込みしてください。");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, page]);

  // UTC日付のフォーマット処理
  function parseUtcDate(value: string) {
    return new Date(/([zZ]|[+\-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`);
  }

  // ○時間前・○分前 などの相対時間表記
  function formatTime(createdAt: string, nowMs: number) {
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

  return (
    <>
      {/* 💡 ヘッダーとログインボタンを重ねて配置するエリア */}
      <div className="relative">
        <Header />

        {/* 💡 ヘッダーの右上に重ねて表示するログインボタン */}
        <div className="absolute top-0 right-0 z-50 flex h-full items-center pr-4">
          <Link
            href="/login" 
            className="rounded-full border-2 border-white bg-[#891630] px-3 py-1 text-xs font-bold text-white transition hover:bg-white hover:text-[#891630] active:scale-95"
          >
            ログイン
          </Link>
        </div>
      </div>

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-4 py-6">

          {/* タイトル */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              みんなの「あるある」を楽しもう
            </h1>
          </div>
        
          {/* 説明 */}
          <p className="mb-8 text-center text-sm text-[#7F7F7F]">
            ※投稿内容は個人の創作・発言です
          </p>
          
          {/* タブ切り替え */}
          <FeedTabs activeTab={activeTab} onChange={handleTabChange} />

          {/* 投稿一覧 */}
          <div>
            {loading ? (
              <div className="bg-white p-6 text-center text-gray-500">
                投稿を読み込み中です...
              </div>
            ) : error ? (
              <div className="bg-white p-6 text-center text-red-500">
                {error}
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map((post) => {
                  const isMyPost = post.user_id === 1;
                  const userName = isMyPost && myProfile.nickname ? myProfile.nickname : `ユーザー${post.user_id}`;
                  const userAvatar = isMyPost 
                    ? (iconMap[myProfile.icon] ?? "/images/profile/profile01.png")
                    : (iconMap[post.icon ?? "1"] ?? "/images/profile/profile01.png");

                  return (
                    <PoemPostCard
                      key={post.post_id}
                      postId={post.post_id}
                      user={userName}
                      avatar={userAvatar}
                      poem={post.poem_text}
                      likes={post.likes_count}
                      isLiked={post.is_liked}
                      date={formatTime(post.created_at, now)}
                    />
                  );
                })}

                {/* 2ページ以上ある場合にページネーションを表示 */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </>
            ) : (
              <div className="bg-white p-6 text-center text-gray-500">
                投稿がありません。
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}