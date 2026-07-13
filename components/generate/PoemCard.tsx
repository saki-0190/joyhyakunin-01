import Image from "next/image";

type PoemCardProps = {
  poem: string;
  illustration: string;
};

export default function PoemCard({
  poem,
  illustration,
}: PoemCardProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border-[20px]
        border-[#385723]
        bg-[#FFFDF8]
        shadow-lg
      "
    >
      <div className="flex flex-col items-center px-8 py-10">

        {/* 一首 */}
        <pre
          className="
            whitespace-pre-wrap
            text-2xl
            tracking-widest
            text-[#3B2F2F]
            font-serif
            mx-auto
          "
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
            height: "200px",
            lineHeight: "2.5",
          }}
        >
          {poem}
        </pre>

        {/* イラスト */}
        <div className="mt-8">
          <Image
            src={illustration}
            alt="キャラクター"
            width={250}
            height={220}
            priority
          />
        </div>

      </div>
    </div>
  );
}