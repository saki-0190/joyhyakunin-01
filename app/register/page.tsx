"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const profileImageOptions = [
  "/images/profile/profile01.png",
  "/images/profile/profile02.png",
  "/images/profile/profile03.png",
  "/images/profile/profile04.png",
  "/images/profile/profile05.png",
  "/images/profile/profile06.png",
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState("");
  const [profileImageUrl, setProfileImageUrl] =  useState<string>("/images/profile/profile01.png");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedNickname = nickname.trim();
    const trimmedFullName = fullName.trim();
    const trimmedIndustry = industry.trim();

    if (!trimmedNickname) {
      setError("ニックネームは必須です");
      return;
    }

    if (trimmedNickname.length > 10) {
      setError("ニックネームは10文字以内で入力してください");
      return;
    }

    if (trimmedFullName.length > 10) {
      setError("名前は10文字以内で入力してください");
      return;
    }

    if (trimmedIndustry.length > 15) {
      setError("業種は15文字以内で入力してください");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setError("パスワードは8文字以上で、英字と数字をそれぞれ1文字以上含めてください");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname: trimmedNickname,
          full_name: trimmedFullName,
          industry: trimmedIndustry,
          profile_image_url: profileImageUrl,
        }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        let message = "登録に失敗しました";

        if (contentType.includes("application/json")) {
          const err = (await res.json()) as {
            detail?:
            | string
            | Array<{
              msg?: string;
            }>;
          };

          if (typeof err.detail === "string") {
            message = err.detail;
          } else if (Array.isArray(err.detail) && err.detail.length > 0) {
            message = err.detail[0]?.msg || message;
          }
        } else {
          const text = await res.text();
          if (text && !text.toLowerCase().includes("internal server error")) {
            message = text;
          }
        }

        setError(message);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = (await res.json()) as {
          id?: unknown;
          email?: unknown;
          nickname?: unknown;
          full_name?: unknown;
          industry?: unknown;
          profile_image_url?: unknown;
        };

        if (typeof data.id === "number") {
          localStorage.setItem("user", JSON.stringify(data));
        }
      }

      router.replace("/");
    } catch (fetchError) {
      console.error("登録通信エラー:", fetchError);
      setError("サーバーに接続できませんでした。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff8ef_0%,_#f6efe7_50%,_#efe4d8_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-[#8a6b3d]">ENJOY HYAKUNIN ISSHU</p>
          <h1 className="mt-2 text-3xl font-bold text-[#891630]">新規登録</h1>
          <p className="mt-2 text-sm text-[#6f655a]">アカウントを作成して、投稿や「わかる！」に参加しよう</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#eadbc6] bg-white/95 p-6 shadow-[0_12px_40px_rgba(96,20,25,0.12)] backdrop-blur"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="nickname" className="mb-2 block text-sm font-semibold text-[#4e4338]">
                ニックネーム
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="たろう"
                autoComplete="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                required
                className="w-full rounded-xl border border-[#e4d6c2] bg-[#fffdfa] px-4 py-3 text-[#2f2a24] outline-none transition focus:border-[#891630] focus:ring-2 focus:ring-[#f3d9dd]"
              />
              <p className="mt-1 text-xs text-[#7f7366]">10文字以内・空欄不可</p>
            </div>

            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-[#4e4338]">
                名前
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="田中誠一"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={10}
                required
                className="w-full rounded-xl border border-[#e4d6c2] bg-[#fffdfa] px-4 py-3 text-[#2f2a24] outline-none transition focus:border-[#891630] focus:ring-2 focus:ring-[#f3d9dd]"
              />
              <p className="mt-1 text-xs text-[#7f7366]">10文字以内</p>
            </div>

            <div>
              <label htmlFor="industry" className="mb-2 block text-sm font-semibold text-[#4e4338]">
                業種
              </label>
              <input
                id="industry"
                type="text"
                placeholder="製造業"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                maxLength={15}
                required
                className="w-full rounded-xl border border-[#e4d6c2] bg-[#fffdfa] px-4 py-3 text-[#2f2a24] outline-none transition focus:border-[#891630] focus:ring-2 focus:ring-[#f3d9dd]"
              />
              <p className="mt-1 text-xs text-[#7f7366]">15文字以内</p>
            </div>

            <div>
              <p className="mb-2 block text-sm font-semibold text-[#4e4338]">アイコン</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {profileImageOptions.map((option) => {
                  const isSelected = profileImageUrl === option;
                  return (
                    <label
                      key={option}
                      className={`cursor-pointer rounded-xl border bg-white p-2 transition ${isSelected
                        ? "border-[#891630] ring-2 ring-[#f3d9dd]"
                        : "border-[#e4d6c2] hover:border-[#b5868f]"
                        }`}
                    >
                      <input
                        type="radio"
                        name="profileImage"
                        value={option}
                        checked={isSelected}
                        onChange={(e) => setProfileImageUrl(e.target.value)}
                        className="sr-only"
                      />
                      <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full">
                        <Image src={option} alt="プロフィールアイコン" fill className="object-cover" sizes="48px" />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#4e4338]">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#e4d6c2] bg-[#fffdfa] px-4 py-3 text-[#2f2a24] outline-none transition focus:border-[#891630] focus:ring-2 focus:ring-[#f3d9dd]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#4e4338]">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                placeholder="英字+数字を含む8文字以上"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                required
                className="w-full rounded-xl border border-[#e4d6c2] bg-[#fffdfa] px-4 py-3 text-[#2f2a24] outline-none transition focus:border-[#891630] focus:ring-2 focus:ring-[#f3d9dd]"
              />
              <p className="mt-1 text-xs text-[#7f7366]">8文字以上・英字1文字以上・数字1文字以上</p>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-[#f0c6cb] bg-[#fff4f5] px-3 py-2 text-sm text-[#b3263a]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-[#891630] px-4 py-3 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "登録中..." : "新規登録"}
          </button>

          <p className="mt-4 text-center text-sm text-[#6b6258]">
            すでにアカウントをお持ちの方は
            <Link href="/login" className="ml-1 font-semibold text-[#891630] underline decoration-[#d2a8af] underline-offset-4">
              ログイン
            </Link>
          </p>

          <div className="mt-6 border-t border-[#f0e6d9] pt-4 text-center">
            <Link href="/" className="text-sm font-medium text-[#6b6258] hover:text-[#891630]">
              フィードに戻る
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
