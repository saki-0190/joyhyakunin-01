type ProfileStatsProps = {
  poemCount: number;
  likesReceived: number;
  likesGiven: number;

  selected: "myPoems" | "likesReceived" | "likesGiven";

  onChange: (
    tab: "myPoems" | "likesReceived" | "likesGiven"
  ) => void;
};

export default function ProfileStats({
  poemCount,
  likesReceived,
  likesGiven,
  selected,
  onChange,
}: ProfileStatsProps) {
  return (
    <div className="mt-6 bg-white">

      <div className="grid grid-cols-3 divide-x divide-[#E5DCCF]">

        {/* 詠んだ首 */}
        <button
          onClick={() => onChange("myPoems")}
          className={`
            relative
            py-6
            text-center
            transition

            ${
              selected === "myPoems"
                ? "bg-[#FFF6EF]"
                : "hover:bg-[#FAF8F4]"
            }
          `}
        >
          <p className="text-3xl font-bold text-[#601419]">
            {poemCount}
          </p>

          <p className="mt-2 text-base text-gray-500">
            詠んだ首
          </p>

          {selected === "myPoems" && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[#601419]" />
          )}
        </button>

        {/* わかる！ */}
        <button
          onClick={() => onChange("likesReceived")}
          className={`
            relative
            py-6
            text-center
            transition

            ${
              selected === "likesReceived"
                ? "bg-[#FFF6EF]"
                : "hover:bg-[#FAF8F4]"
            }
          `}
        >
          <p className="text-3xl font-bold text-[#601419]">
            {likesReceived}
          </p>

          <p className="mt-2 text-base text-gray-500">
            わかる！
          </p>

          {selected === "likesReceived" && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[#601419]" />
          )}
        </button>

        {/* 押した数 */}
        <button
          onClick={() => onChange("likesGiven")}
          className={`
            relative
            py-6
            text-center
            transition

            ${
              selected === "likesGiven"
                ? "bg-[#FFF6EF]"
                : "hover:bg-[#FAF8F4]"
            }
          `}
        >
          <p className="text-3xl font-bold text-[#601419]">
            {likesGiven}
          </p>

          <p className="mt-2 text-base text-gray-500">
            押した数
          </p>

          {selected === "likesGiven" && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[#601419]" />
          )}
        </button>

      </div>

    </div>
  );
}