"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Feather,
  UserRound,
} from "lucide-react";
export default function BottomNav() {
  const pathname = usePathname();

  const menu = [
    {
      href: "/",
      label: "フィード",
      icon: House,
    },
    {
      href: "/generate",
      label: "詠む",
      icon: Feather,
    },
    {
      href: "/mypage",
      label: "マイページ",
      icon: UserRound,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors ${
                active
                  ? "text-[#601419]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={24} strokeWidth={2} />

              <span className="mt-1 text-xs font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}