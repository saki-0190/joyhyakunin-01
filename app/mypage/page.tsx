"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Header from "@/components/Header";
import ProfileCard from "@/components/mypage/ProfileCard";
import MypageTabs from "@/components/mypage/MypageTabs";
import MyPoemCard from "@/components/mypage/MyPoemCard";
import FeedCard from "@/components/feed/FeedCard";
import { useRouter } from "next/navigation";
import { getAuthorizationHeader, getStoredUser } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/time";
import { downloadPoemImage } from "@/lib/poemImage";

type TabType = "myPoems" | "likesReceived" | "likesGiven";

type PostItem = {
  post_id: number;
  user_id: number;
  poem_text: string;
  theme: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  author_name?: string;
  author_image_url?: string;
};

const profileImageOptions = [
  "/images/profile/profile01.png",
  "/images/profile/profile02.png",
  "/images/profile/profile03.png",
  "/images/profile/profile04.png",
  "/images/profile/profile05.png",
  "/images/profile/profile06.png",
];

type LikeItem = {
  like_id: number;
  post: PostItem;
  created_at: string;
  liked_by_user_id?: number;
};

type MypageResponse = {
  profile: {
    id: number;
    nickname: string;
    email: string;
    full_name: string;
    industry: string;
    profile_image_url: string;
  };
  my_posts: PostItem[];
  my_likes_given: LikeItem[];
  my_likes_received: LikeItem[];
};

type LikeUiState = {
  liked: boolean;
  likes: number;
};

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    nickname: string;
    full_name?: string;
    industry?: string;
    profile_image_url?: string;
    access_token?: string;
  } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editProfileImageUrl, setEditProfileImageUrl] = useState("/images/profile/profile01.png");
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [savingPostId, setSavingPostId] = useState<number | null>(null);
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [tab, setTab] = useState<TabType>("myPoems");
  const [likeUiState, setLikeUiState] = useState<Record<number, LikeUiState>>({});
  const [data, setData] = useState<MypageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const stored = getStoredUser();
      if (stored) {
        setUser({
          ...stored,
          email: stored.email ?? "",
          nickname: stored.nickname ?? "",
        });
      }
      setAuthReady(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timerId = setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => clearTimeout(timerId);
  }, [toast]);

  const handleOpenEdit = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setEditNickname(user.nickname);
    setEditEmail(user.email);
    setEditFullName(user.full_name ?? "");
    setEditIndustry(user.industry ?? "");
    setEditPassword("");
    setEditProfileImageUrl(user.profile_image_url ?? "/images/profile/profile01.png");
    setEditError(null);
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const authHeader = getAuthorizationHeader();
    if (!authHeader.Authorization) {
      router.push("/login");
      return;
    }

    setEditLoading(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify({
          nickname: editNickname,
          email: editEmail,
          full_name: editFullName,
          industry: editIndustry,
          profile_image_url: editProfileImageUrl,
          password: editPassword || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "プロフィールの更新に失敗しました");
      }

      const updated = (await res.json()) as {
        id: number;
        email: string;
        nickname: string;
        full_name?: string;
        industry?: string;
        profile_image_url?: string;
        access_token?: string;
      };
      const mergedUser = {
        ...updated,
        access_token: updated.access_token ?? user.access_token,
      };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setEditOpen(false);
      setToast({ type: "success", message: "プロフィールを更新しました" });
    } catch (err) {
      console.error(err);
      setEditError(err instanceof Error ? err.message : "プロフィールの更新に失敗しました");
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setToast({ type: "success", message: "ログアウトしました" });
    setTimeout(() => {
      router.replace("/login");
    }, 500);
  };

  const handleSavePoem = async (
    target: HTMLDivElement | null,
    theme: string,
    postId: number
  ) => {
    if (!target || savingPostId !== null) {
      return;
    }

    setSavingPostId(postId);
    try {
      await downloadPoemImage({
        sourceElement: target,
        theme,
      });
      setToast({ type: "success", message: "画像を保存しました！" });
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "画像保存に失敗しました。もう一度お試しください。" });
    } finally {
      setSavingPostId(null);
    }
  };

  const executeDeletePoem = async (postId: number) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const authHeader = getAuthorizationHeader();
    if (!authHeader.Authorization) {
      router.push("/login");
      return;
    }

    setDeletingPostId(postId);
    setConfirmDeletePostId(null);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          ...authHeader,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "削除に失敗しました");
      }

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          my_posts: prev.my_posts.filter((post) => post.post_id !== postId),
          my_likes_received: prev.my_likes_received.filter((item) => item.post.post_id !== postId),
          my_likes_given: prev.my_likes_given.filter((item) => item.post.post_id !== postId),
        };
      });
      setToast({ type: "success", message: "句を削除しました" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: err instanceof Error ? err.message : "削除に失敗しました" });
    } finally {
      setDeletingPostId(null);
    }
  };

  const requestDeletePoem = (postId: number) => {
    setConfirmDeletePostId(postId);
  };

  // 時刻更新
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  // マイページデータ取得
  useEffect(() => {
    if (!authReady) {
      return;
    }

    const userId = user?.id;

    const fetchMypage = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          setData({
            profile: {
              id: 0,
              nickname: "ゲスト",
              email: "",
              full_name: "",
              industry: "",
              profile_image_url: "/images/profile/profile01.png",
            },
            my_posts: [],
            my_likes_given: [],
            my_likes_received: [],
          });
          return;
        }
        const res = await fetch(`/api/mypage/${userId}`);
        if (!res.ok) {
          throw new Error("マイページ情報の取得に失敗しました");
        }

        const json = (await res.json()) as MypageResponse;
        setData(json);
        if (json.profile) {
          const currentStoredUser = getStoredUser();
          const mergedUser = {
            id: json.profile.id,
            email: json.profile.email,
            nickname: json.profile.nickname,
            full_name: json.profile.full_name,
            industry: json.profile.industry,
            profile_image_url: json.profile.profile_image_url,
            access_token: currentStoredUser?.access_token,
          };
          setUser(mergedUser);
          localStorage.setItem("user", JSON.stringify(mergedUser));
        }
      } catch (err) {
        console.error(err);
        setError("データを取得できませんでした。しばらくしてから再度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    fetchMypage();
  }, [authReady, user?.id]);

  const myPoems = data?.my_posts ?? [];
  const likedByOthers = data?.my_likes_received ?? [];
  const likedPoems = data?.my_likes_given ?? [];

  const currentList =
    tab === "myPoems"
      ? myPoems.map((post) => {
        const label = formatRelativeTime(post.created_at, now);
        return {
          id: post.post_id,
          postId: post.post_id,
          poem: post.poem_text,
          theme: post.theme,
          illustration: post.image_url,
          time: label,
          date: label,
          likes: post.likes_count,
          user: post.author_name ?? `ユーザー${post.user_id}`,
          avatar: post.author_image_url ?? "/images/profile/profile01.png",
          canDelete: true,
        };
      })
      : tab === "likesReceived"
        ? likedByOthers.map((item) => {
          const label = formatRelativeTime(item.created_at, now);
          return {
            id: item.like_id,
            postId: item.post.post_id,
            poem: item.post.poem_text,
            theme: item.post.theme,
            time: label,
            date: label,
            likes: item.post.likes_count,
            user: item.post.author_name ?? `ユーザー${item.post.user_id}`,
            avatar: item.post.author_image_url ?? "/images/profile/profile01.png",
            canDelete: true,
          };
        })
        : likedPoems.map((item) => {
          const label = formatRelativeTime(item.created_at, now);
          return {
            id: item.like_id,
            postId: item.post.post_id,
            poem: item.post.poem_text,
            theme: item.post.theme,
            time: label,
            date: label,
            likes: item.post.likes_count,
            user: item.post.author_name ?? `ユーザー${item.post.user_id}`,
            avatar: item.post.author_image_url ?? "/images/profile/profile01.png",
            canDelete: false,
          };
        });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-xl px-4 py-6">

      <div className="mb-6">
         <ProfileCard
          nickname={user?.nickname ?? "ゲスト"}
          fullName={user?.full_name ?? ""}
          industry={user?.industry ?? ""}
          image={user?.profile_image_url ?? "/images/profile/profile01.png"}
          onEdit={handleOpenEdit}
         onLogout={handleLogout}
          />
      </div>

          {editOpen && (
            <section className="mt-4 border border-[#E5DCCF] bg-white p-5">
              <h3 className="text-lg font-bold text-[#891630]">登録情報を編集</h3>

              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="edit-nickname" className="mb-1 block text-sm font-medium text-gray-700">
                    ニックネーム
                  </label>
                  <input
                    id="edit-nickname"
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full rounded-xl border border-[#E2D7C8] px-3 py-2 outline-none focus:border-[#891630]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-email" className="mb-1 block text-sm font-medium text-gray-700">
                    メールアドレス
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#E2D7C8] px-3 py-2 outline-none focus:border-[#891630]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-full-name" className="mb-1 block text-sm font-medium text-gray-700">
                    名前
                  </label>
                  <input
                    id="edit-full-name"
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#E2D7C8] px-3 py-2 outline-none focus:border-[#891630]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-industry" className="mb-1 block text-sm font-medium text-gray-700">
                    業種
                  </label>
                  <input
                    id="edit-industry"
                    type="text"
                    value={editIndustry}
                    onChange={(e) => setEditIndustry(e.target.value)}
                    className="w-full rounded-xl border border-[#E2D7C8] px-3 py-2 outline-none focus:border-[#891630]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-password" className="mb-1 block text-sm font-medium text-gray-700">
                    新しいパスワード（変更時のみ）
                  </label>
                  <input
                    id="edit-password"
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="未入力なら変更しません"
                    className="w-full rounded-xl border border-[#E2D7C8] px-3 py-2 outline-none focus:border-[#891630]"
                  />
                </div>

                <div>
                  <p className="mb-2 block text-sm font-medium text-gray-700">アイコン</p>
                  <div className="mx-auto flex w-full justify-center gap-3 overflow-x-auto pb-1">
                    {profileImageOptions.map((iconUrl) => {
                      const selected = editProfileImageUrl === iconUrl;
                      return (
                        <button
                          key={iconUrl}
                          type="button"
                          onClick={() => setEditProfileImageUrl(iconUrl)}
                          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 p-1 transition ${selected ? "border-[#891630]" : "border-transparent hover:border-[#E8D0D5]"
                            }`}
                        >
                          <Image
                            src={iconUrl}
                            alt="プロフィールアイコン候補"
                            width={56}
                            height={56}
                            className="h-12 w-12 rounded-full border-2 border-[#F6E5EA] object-cover
  "
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {editError && (
                <p className="mt-3 rounded-lg bg-[#FFF0F2] px-3 py-2 text-sm text-[#9E1F38]">
                  {editError}
                </p>
              )}

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={editLoading}
                  className="rounded-lg bg-[#891630] px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                >
                  {editLoading ? "保存中..." : "保存"}
                </button>
              </div>
            </section>
          )}

          {/* タブ切り替え */}
          <MypageTabs
            selected={tab}
            poemCount={myPoems.length}
            likesGiven={likedPoems.length}
            likesReceived={likedByOthers.length}
            onChange={setTab}
          />

          <div>
            {loading ? (
              <div className="bg-white p-6 text-center text-gray-500">
                マイページを読み込み中です...
              </div>
            ) : error ? (
              <div className="bg-white p-6 text-center text-red-500">
                {error}
              </div>
            ) : tab === "myPoems" ? (
              currentList.length > 0 ? (
                currentList.map((poem) => (
                  <MyPoemCard
                    key={poem.id}
                    poem={poem.poem}
                    date={poem.date}
                    user={poem.user}
                    time={poem.time}
                    likes={poem.likes}
                    deleteDisabled={!poem.canDelete}
                    deleteLoading={deletingPostId === poem.postId}
                    downloadLoading={savingPostId === poem.postId}
                    onDownload={(target) => handleSavePoem(target, poem.theme, poem.postId)}
                    onDelete={() => requestDeletePoem(poem.postId)}
                  />
                ))
              ) : (
                <div className="bg-white p-6 text-center text-gray-500">
                  表示する投稿がありません。
                </div>
              )
            ) : currentList.length > 0 ? (
              currentList.map((poem) => {
                const override = likeUiState[poem.postId];
                const baseLiked = tab === "likesGiven";

                return (
                  <FeedCard
                    key={poem.id}
                    postId={poem.postId}
                    user={poem.user}
                    userImage={poem.avatar}
                    time={poem.time}
                    poem={poem.poem}
                    likes={override?.likes ?? poem.likes}
                    likedByMe={override?.liked ?? baseLiked}
                    onLikeStateChange={(changedPostId, next) => {
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
                表示する投稿がありません。
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${toast.type === "error"
              ? "border-[#f0c6cb] bg-[#fff4f5] text-[#b3263a]"
              : "border-[#cae7cc] bg-[#f2fbf2] text-[#2f7a37]"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {confirmDeletePostId !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 px-4 pb-24">
          <div className="w-full max-w-sm border border-[#E5DCCF] bg-white p-4 shadow-2xl">
            <p className="text-sm font-semibold text-[#891630]">この句を削除しますか？</p>
            <p className="mt-1 text-sm text-gray-600">削除すると元に戻せません。</p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeletePostId(null)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => executeDeletePoem(confirmDeletePostId)}
                disabled={deletingPostId !== null}
                className="flex-1 rounded-lg bg-[#891630] px-3 py-2 text-sm font-medium text-white hover:bg-[#7A1A21] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingPostId !== null ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
