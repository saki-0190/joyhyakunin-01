type FeedTabsProps = {
  activeTab: "popular" | "latest";
  onChange: (tab: "popular" | "latest") => void;
};

export default function FeedTabs({
  activeTab,
  onChange,
}: FeedTabsProps) {
  return (
    <div className="bg-white py-2">

      <div className="grid grid-cols-2">

        {/* 新着順 */}
        <button
          onClick={() => onChange("latest")}
          className={`
            relative
            pb-4
            text-xl
            font-bold
            transition-colors

            ${
              activeTab === "latest"
                ? "text-[#891630]"
                : "text-[#7F7F7F]"
            }
          `}
        >
          新着順

          <div
            className={`
              absolute
              bottom-0
              left-0
              h-1
              w-full
              transition-colors

              ${
                activeTab === "latest"
                  ? "h-1 bg-[#891630]"
                  : "h-px bg-[#7F7F7F]"
              }
            `}
          />
        </button>

        {/* わかる順 */}
        <button
          onClick={() => onChange("popular")}
          className={`
            relative
            pb-4
            text-xl
            font-bold
            transition-colors

            ${
              activeTab === "popular"
                ? "text-[#891630]"
                : "text-[#7F7F7F]"
            }
          `}
        >
          わかる順

          <div
            className={`
              absolute
              bottom-0
              left-0
              h-1
              w-full
              transition-colors

              ${
                activeTab === "popular"
                  ? "h-1 bg-[#891630]"
                  : "h-px bg-[#7F7F7F]"
              }
            `}
          />
        </button>

      </div>

    </div>
  );
}