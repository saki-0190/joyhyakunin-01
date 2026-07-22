"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import Avatar from "@/components/common/Avatar";

type ProfileCardProps = {
  name: string;
  image: string;
  realName?: string;
  industry?: string;
};

export default function ProfileCard({
  name,
  image,
}: ProfileCardProps) {
  return (
    <div>
      {/* 上段 */}
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center gap-4">
          {/* アイコン */}
          <Avatar
            src={image}
            alt={name}
            size={100}
          />

          <div>
            <h2 className="text-2xl font-bold text-[#601419]">
              {name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              田中誠一 / 製造業
            </p>
          </div>
        </div>

        {/* 編集ボタン */}
        <Link
          href="/mypage/edit"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-[#891630]
            border-2
            border-[#891630]
            transition
            hover:bg-[#F6E5EA]
          "
        >
          <Pencil size={16} />
          編集
        </Link>
      </div>
    </div>
  );
}