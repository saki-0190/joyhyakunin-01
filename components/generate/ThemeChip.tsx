type ThemeChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function ThemeChip({
  label,
  selected,
  onClick,
}: ThemeChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full
        border
        px-4
        py-2
        text-sm
        font-medium
        transition-all
        duration-200
        ${
          selected
            ? "border-[#891630] bg-[#FBEBEC] text-[#891630]"
            : "border-gray-300 bg-white text-gray-700 hover:border-[#891630] hover:text-[#891630]"
        }
      `}
    >
      {label}
    </button>
  );
}