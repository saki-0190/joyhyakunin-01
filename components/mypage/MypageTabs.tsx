type MypageTabsProps = {
  poemCount: number;
  likesReceived: number;
  likesGiven: number;

  selected: "myPoems" | "likesReceived" | "likesGiven";

  onChange: (
    tab: "myPoems" | "likesReceived" | "likesGiven"
  ) => void;
};

export default function MypageTabs({
  poemCount,
  likesReceived,
  likesGiven,
  selected,
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
          const isselected = selected === tab.key;

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
                  isselected
                    ? "text-[#1A1A1A]"
                    : "text-[#7F7F7F]"
                }`}
              >
                {tab.label}
              </p>

              <p
                className={`mt-2 text-3xl font-bold ${
                  isselected
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
                    isselected
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