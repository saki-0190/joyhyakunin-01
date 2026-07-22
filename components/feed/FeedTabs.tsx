type FeedTabsProps = {
  activeTab: "popular" | "latest";
  onChange: (tab: "popular" | "latest") => void;
};

export default function FeedTabs({
  activeTab,
  onChange,
}: FeedTabsProps) {
  return (
    <div className="mb-6 flex items-center justify-end gap-3">
      <span className="text-sm text-gray-500">
        並び順：
      </span>

      <button
        onClick={() => onChange("popular")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeTab === "popular"
            ? "bg-[#FBEBEC] text-[#601419]"
            : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        わかる！順
      </button>

      <button
        onClick={() => onChange("latest")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeTab === "latest"
            ? "bg-[#FBEBEC] text-[#601419]"
            : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        新着順
      </button>
    </div>
  );
}