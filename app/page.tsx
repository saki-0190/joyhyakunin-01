"use client";

import { useState, useEffect } from "react";

import Header from "@/components/Header";
import FeedCard from "@/components/feed/FeedCard";
import FeedTabs from "@/components/feed/FeedTabs";
import Pagination from "@/components/Pagination";

import { getAuthorizationHeader } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/time";

type PostItem = {
  post_id: number;
  user_id: number;
  poem_text: string;
  theme: string;
  image_url: string;
  likes_count: number;
  liked_by_me?: boolean;
  created_at: string;
  author_name?: string;
  author_image_url?: string;
};

type LikeUiState = {
  liked: boolean;
  likes: number;
};

type PostsResponse = {
  items: PostItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<
    "popular" | "latest"
  >("latest");

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [likeUiState, setLikeUiState] = useState<
    Record<number, LikeUiState>
  >({});

  // ページネーション
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [degraded, setDegraded] = useState(false);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setDegraded(false);

    try {
      const authHeader = getAuthorizationHeader();

      const res = await fetch(
        `/api/posts?sort=${activeTab}&page=${page}&limit=${LIMIT}`,
        {
          headers: {
            ...authHeader,
          },
          cache: "no-store",
        }
      );

      if (res.headers.get("x-backend-status") === "503") {
        setDegraded(true);
      }

      if (!res.ok) {
        throw new Error("投稿一覧の取得に失敗しました");
      }

      const data = (await res.json()) as PostsResponse;

      console.log("APIレスポンス", data);

      setPosts(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("投稿取得エラー:", error);
      setError(
        "投稿の読み込みに失敗しました。再読み込みしてください。"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [activeTab, page]);

    return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-xl px-4 py-6">
          {/* タイトル */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-gray-800">
              みんなの「あるある」を楽しもう
            </h1>
          </div>

          {/* 説明 */}
          <p className="mb-8 text-center text-gray-500">
            ※投稿内容は個人の創作・発言です
          </p>

          {/* タブ */}
          <FeedTabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
          />

          {/* バックエンド接続警告 */}
          {degraded ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
              いま投稿サーバーが不安定なため、一時的に投稿一覧を表示できない場合があります。
            </div>
          ) : null}

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
              posts.map((post) => {
                const override = likeUiState[post.post_id];

                return (
                  <FeedCard
                    key={post.post_id}
                    postId={post.post_id}
                    user={
                      post.author_name ??
                      `ユーザー${post.user_id}`
                    }
                    userImage={
                      post.author_image_url ??
                      "/images/profile/profile01.png"
                    }
                    time={formatRelativeTime(
                      post.created_at,
                      now
                    )}
                    poem={post.poem_text}
                    likes={
                      override?.likes ??
                      post.likes_count
                    }
                    likedByMe={
                      override?.liked ??
                      Boolean(post.liked_by_me)
                    }
                    onLikeStateChange={(
                      changedPostId,
                      next
                    ) => {
                      setLikeUiState((prev) => ({
                        ...prev,
                        [changedPostId]: next,
                      }));
                    }}
                  />
                );
              })
            ) : (
              <div className="bg-white p-6 text-center text-gray-500">
                投稿がありません。
              </div>
            )}
          </div>
                    {/* ページネーション */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                  setPage(nextPage);

                  window.scrollTo({
                    top: 0,
                  });
                }}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}