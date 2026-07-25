"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { getAuthorizationHeader, getStoredUser } from "@/lib/auth";

import ThemeSelector from "@/components/generate/ThemeSelector";
import EpisodeInput from "@/components/generate/EpisodeInput";
import GenerateButton from "@/components/generate/GenerateButton";
import PoemCard from "@/components/generate/PoemCard";
import ActionButtons from "@/components/generate/ActionButtons";
import { downloadPoemImage } from "@/lib/poemImage";

const illustrations = [
  "/images/characters/character01.png",
  "/images/characters/character02.png",
  "/images/characters/character03.png",
  "/images/characters/character04.png",
  "/images/characters/character05.png",
];

export default function GeneratePage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] =
    useState("営業あるある");

  const [episode, setEpisode] = useState("");
  const [episodeError, setEpisodeError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [postToast, setPostToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [poem, setPoem] = useState("");

  const [illustration, setIllustration] = useState(
    illustrations[0]
  );
  const poemCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!postToast) return;

    const timerId = setTimeout(() => {
      setPostToast(null);
    }, 2200);

    return () => clearTimeout(timerId);
  }, [postToast]);

  const handleGenerate = async () => {
    const trimmedEpisode = episode.trim();
    if (!trimmedEpisode) {
      setEpisodeError("エピソードを入力してください（50文字以内）");
      return;
    }

    setEpisodeError(null);
    setPostToast(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: selectedTheme,
          episode: trimmedEpisode,
        }),
      });

      if (!res.ok) {
        throw new Error("生成に失敗しました");
      }

      const data = await res.json();
      setPoem(data.poem || "");

      const random =
        illustrations[
        Math.floor(Math.random() * illustrations.length)
        ];
      setIllustration(random);
    } catch (error) {
      console.error(error);
      setPostToast({
        type: "error",
        message: "一首の生成に失敗しました。もう一度お試しください。",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!poem || !poemCardRef.current || savingImage) {
      return;
    }

    setSavingImage(true);
    try {
      await downloadPoemImage({
        sourceElement: poemCardRef.current,
        theme: selectedTheme,
      });

      setPostToast({
        type: "success",
        message: "画像を保存しました！",
      });
    } catch (error) {
      console.error(error);
      setPostToast({
        type: "error",
        message: "画像保存に失敗しました。もう一度お試しください。",
      });
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-xl px-4 py-6">

          {/* タイトル */}
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              一首を詠む
            </h1>

            <p className="mt-2 text-gray-500">
              あなたのエピソードを
              百人一首にしよう！
            </p>
          </div>

          {/* ①テーマ */}
          <ThemeSelector
            selectedTheme={selectedTheme}
            onSelect={setSelectedTheme}
          />

          {/* ②エピソード */}
          <EpisodeInput
            value={episode}
            error={episodeError}
            onChange={(value) => {
              setEpisode(value);
              if (value.trim()) {
                setEpisodeError(null);
              }
            }}
          />

          {/* ボタン */}
          <div className="mt-8">
            <GenerateButton
              loading={loading}
              onClick={handleGenerate}
            />
          </div>

          {/* 結果 */}
          {poem && (
            <section className="mt-10">

              <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-[#891630]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#891630] text-white">
                  3
                </span>

                生成された一首
              </h2>

              <div ref={poemCardRef}>
                <PoemCard
                  poem={poem}
                  illustration={illustration}
                />
              </div>

            </section>
          )}

          {/* 編集 */}
          {poem && (
            <section className="mt-8">

              <h2 className="mb-3 text-lg font-semibold text-[#891630]">
                編集
              </h2>

              <textarea
                value={poem}
                onChange={(e) =>
                  setPoem(e.target.value)
                }
                className="
                  h-40
                  w-full
                  rounded-2xl
                  border
                  border-[#D9C7A1]
                  bg-white
                  p-4
                  leading-7
                  outline-none
                  focus:border-[#891630]
                "
              />

              <p className="mt-2 text-sm text-gray-500">
                生成結果は自由に編集できます。
              </p>

            </section>
          )}

          {/* アクションボタン */}
          {poem && (
            <ActionButtons
              savingImage={savingImage}
              onSaveImage={handleSaveImage}
              posting={posting}
              onPost={async () => {
                if (posting) return;

                try {
                  const user = getStoredUser();
                  const authHeader = getAuthorizationHeader();
                  if (!user || !authHeader.Authorization) {
                    router.push("/login");
                    return;
                  }

                  setPosting(true);
                  setPostToast(null);

                  const res = await fetch("/api/posts", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...authHeader,
                    },
                    body: JSON.stringify({
                      poem_text: poem,
                      theme: selectedTheme,
                      image_url: illustration,
                    }),
                  });

                  if (!res.ok) {
                    throw new Error("投稿に失敗しました");
                  }

                  setPostToast({
                    type: "success",
                    message: "投稿しました！",
                  });
                  setPoem("");
                } catch (error) {
                  console.error(error);
                  setPostToast({
                    type: "error",
                    message: "投稿に失敗しました。もう一度お試しください。",
                  });
                } finally {
                  setPosting(false);
                }
              }}
            />
          )}

        </div>
      </main>

      {postToast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${postToast.type === "error"
              ? "border-[#f0c6cb] bg-[#fff4f5] text-[#b3263a]"
              : "border-[#cae7cc] bg-[#f2fbf2] text-[#2f7a37]"
              }`}
          >
            {postToast.message}
          </div>
        </div>
      )}
    </>
  );
}