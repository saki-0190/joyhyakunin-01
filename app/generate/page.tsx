"use client";

import { useState } from "react";

import Header from "@/components/Header";

import ThemeSelector from "@/components/generate/ThemeSelector";
import EpisodeInput from "@/components/generate/EpisodeInput";
import GenerateButton from "@/components/generate/GenerateButton";
import PoemCard from "@/components/generate/PoemCard";
import ActionButtons from "@/components/generate/ActionButtons";

export default function GeneratePage() {
  const [selectedTheme, setSelectedTheme] =
    useState("営業あるある");

  const [episode, setEpisode] = useState("");

  const [loading, setLoading] = useState(false);

  const [poem, setPoem] = useState("");

  // イラスト一覧
  const illustrations = [
    "/images/characters/character01.png",
    "/images/characters/character02.png",
    "/images/characters/character03.png",
    "/images/characters/character04.png",
    "/images/characters/character05.png",
  ];

  // 表示するイラスト
  const [illustration, setIllustration] = useState(
    illustrations[0]
  );

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: selectedTheme,
          episode,
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
      alert("一首の生成に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-5 py-6">

          {/* タイトル */}
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold text-[#891630]">
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
            onChange={setEpisode}
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
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#891630] text-white">
                  3
                </span>

                生成された一首
              </h2>

              <PoemCard
                poem={poem}
                illustration={illustration}
              />

            </section>
          )}

          {/* 編集 */}
          {poem && (
            <section className="mt-8">

              <h2 className="mb-3 text-lg font-semibold text-[#601419]">
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
                  focus:border-[#601419]
                "
              />

              <p className="mt-2 text-sm text-gray-500">
                💡 生成結果は自由に編集できます。
              </p>

            </section>
          )}

          {/* アクションボタン */}
          {poem && (
            <div className="mt-6">
              <ActionButtons
                onSave={() => {
                  console.log("保存");
                }}
                onPost={async () => {
                  try {
                    const res = await fetch("/api/posts", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: 1,
                        poem_text: poem,
                        theme: selectedTheme,
                        image_url: illustration,
                      }),
                    });

                    if (!res.ok) {
                      throw new Error("投稿に失敗しました");
                    }

                    alert("投稿しました！");
                  } catch (error) {
                    console.error(error);
                    alert("投稿に失敗しました。もう一度お試しください。");
                  }
                }}
              />
            </div>
          )}

        </div>
      </main>
    </>
  );
}