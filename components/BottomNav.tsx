"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  Feather,
  UserRound,
} from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

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

  const requiresLogin = (href: string) => href === "/generate" || href === "/mypage";

  const handleProtectedNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!requiresLogin(href)) return;
    if (isLoggedIn()) return;

    event.preventDefault();
    router.push("/login");
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-around px-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleProtectedNavigation(event, item.href)}
              className={`flex flex-col items-center transition-colors ${active
                ? "text-[#891630]"
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