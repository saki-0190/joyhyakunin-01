"use client";

import Header from "@/components/Header";
import Avatar from "@/components/common/Avatar";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const industries = [
  "製造業",
  "建設業",
  "卸売業",
  "小売業",
  "金融業",
  "医療・福祉",
  "IT",
  "サービス業",
  "その他",
];

const companySizes = [
  "～50名",
  "50～100名",
  "100～300名",
  "300名～",
];

const icons = [
  {
    id: "1",
    image: "/images/profile/profile01.png",
  },
  {
    id: "2",
    image: "/images/profile/profile02.png",
  },
  {
    id: "3",
    image: "/images/profile/profile03.png",
  },
  {
    id: "4",
    image: "/images/profile/profile04.png",
  },
  {
    id: "5",
    image: "/images/profile/profile05.png",
  },
  {
    id: "6",
    image: "/images/profile/profile06.png",
  },
];

export default function EditProfilePage() {
  const router = useRouter();

  const [realName, setRealName] = useState("");
  const [nickname, setNickname] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [icon, setIcon] = useState("1");

  // 初回表示時に保存済みプロフィールを読み込む
  useEffect(() => {
    const saved = localStorage.getItem("profile");

    if (!saved) {
      setRealName("田中 誠一");
      setNickname("たなかっち");
      setIndustry("製造業");
      setCompanySize("100～300名");
      setIcon("1");
      return;
    }

    const profile = JSON.parse(saved);

    setRealName(profile.realName ?? "");
    setNickname(profile.nickname ?? "");
    setIndustry(profile.industry ?? "");
    setCompanySize(profile.companySize ?? "");
    setIcon(profile.icon ?? "1");
  }, []);

  const handleSave = () => {
    const profile = {
      realName,
      nickname,
      industry,
      companySize,
      icon,
    };

    localStorage.setItem(
      "profile",
      JSON.stringify(profile)
    );

    alert("プロフィールを保存しました");

    router.push("/mypage");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F6F2] pb-24">
        <div className="mx-auto max-w-md px-4 py-6">

          {/* プレビューアイコン */}
          <div className="mb-8 flex justify-center">
            <Avatar
              src={
                icons.find((i) => i.id === icon)?.image ??
                "/images/profile/profile01.png"
              }
              alt="プロフィール"
              size={110}
            />
          </div>

          {/* ニックネーム */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold">
              あだ名（投稿時の表示名）
            </label>

            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#891630]"
            />
          </div>

          {/* 本名 */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold">
              本名
            </label>

            <input
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#891630]"
            />
          </div>

          {/* 業種 */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold">
              業種
            </label>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#891630]"
            >
              {industries.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* 会社規模 */}
          <div className="mb-8">
            <label className="mb-3 block font-semibold">
              会社規模
            </label>

            <div className="flex flex-wrap gap-3">
              {companySizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCompanySize(size)}
                  className={`rounded-full border px-5 py-2 transition ${
                    companySize === size
                      ? "border-[#891630] bg-[#FCECEF] text-[#891630]"
                      : "border-gray-300 bg-white hover:border-[#891630]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

                    {/* アイコン一覧 */}
          <div className="mb-10">
            <label className="mb-3 block font-semibold">
              アイコンを変更
            </label>

            <div className="grid grid-cols-3 gap-4">
              {icons.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIcon(item.id)}
                  className={`rounded-2xl p-3 transition ${
                    icon === item.id
                      ? "bg-[#FCECEF] ring-2 ring-[#891630]"
                      : "hover:bg-[#FFF7F9]"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Avatar
                      src={item.image}
                      alt={`アイコン${item.id}`}
                      size={72}
                    />

                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 保存 */}
          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-[#891630] py-4 text-lg font-bold text-white transition hover:bg-[#741227]"
          >
            保存する
          </button>

        </div>
      </main>
    </>
  );
}