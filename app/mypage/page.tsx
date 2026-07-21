"use client";

import { useEffect, useState } from "react";

import Header from "@/components/Header";
import Pagination from "@/components/common/Pagination";
import ProfileCard from "@/components/mypage/ProfileCard";
import MypageTabs from "@/components/mypage/MypageTabs";
import MyPoemCard from "@/components/mypage/MyPoemCard";
import PoemPostCard from "@/components/common/PoemPostCard";

type TabType = "myPoems" | "likesReceived" | "likesGiven";

// 1. 自分が詠んだ首
type MyPoem = {
  post_id?: number;
  id?: number;
  theme?: string;
  poem_text?: string;
  poem?: string;
  created_at?: string;
  date?: string;
  likes_count?: number;
  likes?: number;
  is_liked?: boolean;
};

// 2. わかる！した/されたデータ用型
type LikeItem = {
  like_id?: number;
  liked_by_user_id?: number;
  created_at?: string;
  post: {
    post_id: number;
    user_id: number;
    poem_text: string;
    theme?: string;
    likes_count: number;
    created_at: string;
    is_liked?: boolean;
    icon?: string;
  };
};

// プロフィール
type Profile = {
  realName: string;
  nickname: string;
  industry: string;
  companySize: string;
  icon: string;
};

// ユーザーID（開発用定数）
const USER_ID = 1;

export default function MyPage() {
  const [tab, setTab] = useState<TabType>("myPoems");
  const [myPoems, setMyPoems] = useState<MyPoem[]>([]);
  const [likesGiven, setLikesGiven] = useState<LikeItem[]>([]); // わかる！した首
  const [likesReceived, setLikesReceived] = useState<LikeItem[]>([]); // わかる！された首
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPoems, setTotalPoems] = useState(0);

  const LIMIT = 10;

  // プロフィール（初期値）
  const [profile, setProfile] = useState<Profile>({
    realName: "田中 誠一",
    nickname: "たなかっち",
    industry: "製造業",
    companySize: "100～300名",
    icon: "5",
  });

  // アイコン対応表
  const iconMap: Record<string, string> = {
    "1": "/images/profile/profile01.png",
    "2": "/images/profile/profile02.png",
    "3": "/images/profile/profile03.png",
    "4": "/images/profile/profile04.png",
    "5": "/images/profile/profile05.png",
    "6": "/images/profile/profile06.png",
  };

  // API経由でマイページデータ（自分の投稿、わかる！した/された）を取得
  useEffect(() => {
    async function fetchMyPageData() {
      setLoading(true);

      try {
        const res = await fetch(`/api/mypage/${USER_ID}?page=${page}&limit=${LIMIT}`);
        if (!res.ok) {
          throw new Error("マイページデータの取得に失敗しました");
        }

        const data = await res.json();

        // 1. 自分の投稿一覧
        const fetchedList = data.items ?? data.my_posts ?? [];
        setMyPoems(fetchedList);

        // 2. 自分が「わかる！」した一覧
        setLikesGiven(data.my_likes_given ?? []);

        // 3. 自分の投稿に「わかる！」された一覧
        setLikesReceived(data.my_likes_received ?? []);

        setTotalPages(
          data.totalPages ?? (Math.ceil((fetchedList.length || 0) / LIMIT) || 1)
        );  
        setTotalPoems(data.total ?? fetchedList.length ?? 0);
      } catch (error) {
        console.error("API取得失敗", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyPageData();
  }, [page]);

  // プロフィール画面から戻ってきたときに最新状態を再読み込みする処理
  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem("profile");
      if (!saved) return;

      try {
        const data: Profile = JSON.parse(saved);
        setProfile(data);
      } catch (error) {
        console.error("プロフィール読込失敗", error);
      }
    };

    loadProfile();

    window.addEventListener("focus", loadProfile);
    return () => {
      window.removeEventListener("focus", loadProfile);
    };
  }, []);

  // 日付の簡易フォーマット関数
  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // 削除処理ハンドラー
  const handleDelete = async (postId?: number) => {
    if (!postId) return;

    const isConfirmed = window.confirm("この投稿を削除してもよろしいですか？");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setMyPoems((prev) => prev.filter((poem) => (poem.post_id ?? poem.id) !== postId));
      setTotalPoems((prev) => Math.max(0, prev - 1));
      alert("削除しました。");

    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-4 py-6">

          {/* プロフィール表示 */}
          <ProfileCard
            name={profile.nickname}
            image={iconMap[profile.icon] ?? "/images/profile/profile01.png"}
          />

          {/* タブ切り替え */}
          <MypageTabs
            activeTab={tab}
            poemCount={totalPoems}
            likesGiven={likesGiven.length}
            likesReceived={likesReceived.length}
            onChange={setTab}
          />

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              読み込み中...
            </div>
          ) : (
            <div>

              {/* ① 詠んだ首 */}
              {tab === "myPoems" && (
                <>
                  {myPoems.length > 0 ? (
                    myPoems.map((item, index) => {
                      const targetId = item.post_id ?? item.id;
                      const cardId = targetId ?? index;
                      const poemText = item.poem_text ?? item.poem ?? "";
                      const displayDate = formatDate(item.created_at ?? item.date);
                      const likesCount = item.likes_count ?? item.likes ?? 0;

                      return (
                        <MyPoemCard
                          key={cardId}
                          poem={poemText}
                          date={displayDate}
                          likes={likesCount}
                          onDownload={() => alert("保存")}
                          onDelete={() => handleDelete(targetId)}
                        />
                      );
                    })
                  ) : (
                    <div className="bg-white p-6 text-center text-gray-500">
                      表示する投稿がありません。
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                </>
              )}

              {/* ② わかる！した首（自分が高評価を押した他人の首／自分の首） */}
              {tab === "likesGiven" && (
                likesGiven.length > 0 ? (
                  likesGiven.map((item) => {
                    const post = item.post;

                    // 投稿者が自分（USER_ID: 1）か判定して名前とアイコンを設定
                    const isMyPost = post.user_id === USER_ID;
                    const userName = isMyPost && profile.nickname ? profile.nickname : `ユーザー${post.user_id}`;
                    const userAvatar = isMyPost
                      ? (iconMap[profile.icon] ?? "/images/profile/profile01.png")
                      : (iconMap[post.icon ?? "1"] ?? "/images/profile/profile01.png");

                    return (
                      <PoemPostCard
                        key={item.like_id ?? post.post_id}
                        postId={post.post_id}
                        user={userName}
                        avatar={userAvatar}
                        poem={post.poem_text}
                        likes={post.likes_count}
                        isLiked={true}
                        date={formatDate(post.created_at)}
                      />
                    );
                  })
                ) : (
                  <div className="bg-white p-6 text-center text-gray-500">
                    表示する投稿がありません。
                  </div>
                )
              )}

              {/* ③ わかる！された首（自分の作成した投稿のうち「わかる！」を押されたもの） */}
              {tab === "likesReceived" && (
                likesReceived.length > 0 ? (
                  likesReceived.map((item) => {
                    const post = item.post;

                    // 💡 自分の投稿なので、表示名は自分のニックネームと自分のアイコンで固定
                    const userName = profile.nickname || `ユーザー${USER_ID}`;
                    const userAvatar = iconMap[profile.icon] ?? "/images/profile/profile01.png";

                    return (
                      <PoemPostCard
                        key={item.like_id ?? post.post_id}
                        postId={post.post_id}
                        user={userName}
                        avatar={userAvatar}
                        poem={post.poem_text}
                        likes={post.likes_count}
                        isLiked={post.is_liked ?? true}
                        date={formatDate(item.created_at ?? post.created_at)}
                      />
                    );
                  })
                ) : (
                  <div className="bg-white p-6 text-center text-gray-500">
                    表示する投稿がありません。
                  </div>
                )
              )}

            </div>
          )}

        </div>
      </main>
    </>
  );
}