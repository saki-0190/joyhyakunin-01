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
    <div className="flex justify-center">
      <div
        className="
          w-[420px]
          h-[640px]
          overflow-hidden
          rounded-xl
          border-[20px]
          border-[#385723]
          bg-[#FFFDF8]
          shadow-lg
        "
      >
        <div className="flex h-full flex-col items-center px-10 pt-5 pb-0">
          {/* 一首 */}
          <pre
            className="
              mx-auto
              whitespace-pre-wrap
              font-serif
              text-2xl
              tracking-widest
              text-[#3B2F2F]
            "
            style={{
              writingMode: "vertical-rl",
              textOrientation: "upright",
              height: "270px",
              lineHeight: "2.5",
            }}
          >
            {poem}
          </pre>

          {/* イラスト */}
          <div className="mt-auto flex justify-center pb-4">
            <Image
              src={illustration}
              alt="キャラクター"
              width={280}
              height={250}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}