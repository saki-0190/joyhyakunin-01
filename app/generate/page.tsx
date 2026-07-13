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

  const handleGenerate = () => {
    setLoading(true);

    setTimeout(() => {

      setPoem(`上司の指示で
困惑

運動会では
トンカツ`);

      // ランダムにイラストを選択
      const random =
        illustrations[
          Math.floor(Math.random() * illustrations.length)
        ];

      setIllustration(random);

      setLoading(false);

    }, 2000);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-5 py-6">

          {/* タイトル */}
          <div className="mb-8 text-center">

            <h1 className="text-xl font-bold text-[#601419]">
              一首を詠む
            </h1>

            <p className="mt-2 text-gray-500">
              あなたのエピソードを
              ジョイマン風百人一首にしよう！
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

              <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-[#601419]">

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#601419] text-white">
                  3
                </span>

                生成された一首

              </h2>

              <PoemCard
                poem={poem}
                illustration={illustration}
              />

<ActionButtons
  onSave={() => {
    console.log("保存");
  }}
  onPost={() => {
    console.log("投稿");
  }}
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

        </div>
      </main>
    </>
  );
}