"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";

type ProfileCardProps = {
  name: string;
  image: string;
  onEdit: () => void;
};

export default function ProfileCard({
  name,
  image,
  onEdit,
}: ProfileCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      {/* 上段 */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          {/* アイコン */}
          <Image
            src={image}
            alt={name}
            width={80}
            height={80}
            className="rounded-full border-4 border-[#F6E5EA] object-cover"
          />

          <div>

            <h2 className="text-2xl font-bold text-[#601419]">
              {name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              田中誠一/製造業
            </p>

          </div>

        </div>

        {/* 編集ボタン */}
        <button
          onClick={onEdit}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#F6E5EA]
            px-4
            py-2
            text-sm
            font-medium
            text-[#601419]
            transition
            hover:bg-[#EFD4DB]
          "
        >
          <Pencil size={16} />
          編集
        </button>

      </div>

    </div>
  );
}