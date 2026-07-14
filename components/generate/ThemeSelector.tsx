import ThemeChip from "./ThemeChip";

type ThemeSelectorProps = {
  selectedTheme: string;
  onSelect: (theme: string) => void;
};

const themes = [
  "営業あるある",
  "会議あるある",
  "上司あるある",
  "残業あるある",
  "新人あるある",
];

export default function ThemeSelector({
  selectedTheme,
  onSelect,
}: ThemeSelectorProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#891630]">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#891630] text-sm text-white">
          1
        </span>
        テーマを選ぶ
      </h2>

      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => (
          <ThemeChip
            key={theme}
            label={theme}
            selected={selectedTheme === theme}
            onClick={() => onSelect(theme)}
          />
        ))}
      </div>
    </section>
  );
}