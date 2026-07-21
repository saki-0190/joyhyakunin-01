type PoemCardProps = {
  poem: string;
};

export default function PoemCard({
  poem,
}: PoemCardProps) {
  return (
    <div className="mx-4">
    <div
      className="
        min-h-32
        rounded-2xl
        border-4
        border-[#D9C7A1]
        bg-[#FFFDF8]
        px-8
        py-4
        flex
        items-center
        justify-center
      "
    >
      <pre
        className="
          whitespace-pre-wrap
          text-center
          text-2xl
          leading-[2.0]
          text-[#1A1A1A]
          font-serif
        "
      >
        {poem}
      </pre>
    </div>
    </div>
  );
}