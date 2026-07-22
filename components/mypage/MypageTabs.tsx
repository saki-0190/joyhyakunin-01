type MypageTabsProps = {
  activeTab: "myPoems" | "likesReceived" | "likesGiven";

  poemCount: number;
  likesReceived: number;
  likesGiven: number;

  onChange: (
    tab: "myPoems" | "likesReceived" | "likesGiven"
  ) => void;
};

export default function MypageTabs({
  activeTab,
  poemCount,
  likesReceived,
  likesGiven,
  onChange,
}: MypageTabsProps) {
  const tabs = [
    {
      key: "myPoems",
      label: "詠んだ首",
      count: poemCount,
    },
    {
      key: "likesGiven",
      label: "わかる！した首",
      count: likesGiven,
    },
    {
      key: "likesReceived",
      label: "わかる！された首",
      count: likesReceived,
    },
  ] as const;

  return (
    <div className="bg-white">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="
                relative
                py-4
                transition-colors
              "
            >
              <p
                className={`text-base font-bold ${
                  selected
                    ? "text-[#1A1A1A]"
                    : "text-[#7F7F7F]"
                }`}
              >
                {tab.label}
              </p>

              <p
                className={`mt-2 text-3xl font-bold ${
                  selected
                    ? "text-[#891630]"
                    : "text-[#7F7F7F]"
                }`}
              >
                {tab.count}
              </p>

              <div
                className={`
                  absolute
                  bottom-0
                  left-0
                  w-full
                  ${
                    selected
                      ? "h-1 bg-[#891630]"
                      : "h-px bg-[#D9D9D9]"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}