import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#891630] text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          エンジョイ百人一首
        </Link>
      </div>
    </header>
  );
}