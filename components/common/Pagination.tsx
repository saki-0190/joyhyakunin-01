type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const MAX_VISIBLE = 5;

  let start = Math.max(
    1,
    currentPage - Math.floor(MAX_VISIBLE / 2)
  );

  let end = start + MAX_VISIBLE - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - MAX_VISIBLE + 1);
  }

  const pages = [];

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* 最初 */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="h-10 w-10 text-[#7F7F7F] hover:text-[#D9D9D9] transition-colors"
        >
          {"<<"}
        </button>
      )}

      {/* 前 */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="h-10 w-10 text-[#7F7F7F] hover:text-[#D9D9D9] transition-colors"
        >
          {"<"}
        </button>
      )}

      {/* ページ番号 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-md font-semibold transition-colors
            focus:outline-none
            focus:ring-0
            active:bg-transparent
            ${
              page === currentPage
                ? "text-[#891630]"
                : "text-[#7F7F7F] hover:text-[#D9D9D9]"
            }`}
        >
          {page}
        </button>
      ))}

      {/* 次 */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="h-10 w-10 text-[#7F7F7F] hover:text-[#D9D9D9] transition-colors"
        >
          {">"}
        </button>
      )}

      {/* 最後 */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="h-10 w-10 text-[#7F7F7F] hover:text-[#D9D9D9] transition-colors"
        >
          {">>"}
        </button>
      )}
    </div>
  );
}