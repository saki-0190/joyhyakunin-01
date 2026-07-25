"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";

type ProfileCardProps = {
  nickname: string;
  fullName: string;
  industry: string;
  image: string;
  onEdit: () => void;
  onLogout: () => void;
};

export default function ProfileCard({
  nickname,
  fullName,
  industry,
  image,
  onEdit,
  onLogout,
}: ProfileCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      {/* 上段 */}
      <div className="flex items-center justify-between">
        {/* 左側 */}
        <div className="flex items-center gap-4">
          <Image
            src={image}
            alt={nickname}
            width={80}
            height={80}
            className="rounded-full border-4 border-[#F6E5EA] object-cover"
          />

          <div>
            <h2 className="text-2xl font-bold text-[#891630]">
              {nickname}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {fullName || "未設定"} / {industry || "未設定"}
            </p>
          </div>
        </div>

        {/* 右側（ボタンを縦並び） */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onEdit}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#F6E5EA]
              px-4
              py-2
              text-sm
              font-medium
              text-[#891630]
              transition
              hover:bg-[#EFD4DB]
            "
          >
            <Pencil size={16} />
            編集
          </button>

          <button
            onClick={onLogout}
            className="
              rounded-lg
              border
              border-[#891630]
              bg-white
              px-2
              py-2
              text-sm
              font-medium
              text-[#891630]
              transition
              hover:bg-[#FAF6F7]
            "
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}