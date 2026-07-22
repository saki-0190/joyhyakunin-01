type EpisodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
};

export default function EpisodeInput({
  value,
  onChange,
  error,
}: EpisodeInputProps) {
  const maxLength = 50;

  return (
    <section className="mt-8">

      {/* タイトル */}
      <div className="mb-5">

        <div className="flex items-center gap-3">

          <span
            className="
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#891630]
        text-sm
        font-bold
        text-white
      "
          >
            2
          </span>

          <h2 className="text-xl font-bold text-[#891630]">
            エピソードを入力
          </h2>

        </div>

        <p className="ml-[52px] mt-2 text-base text-gray-500">
          選んだテーマに沿って書いてみよう
        </p>

      </div>

      {/* 入力欄 */}
      <textarea
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`例：
上司の指示が毎回変わる。
昨日の正解が、今日は不正解になる不思議。`}
        className="
          h-40
          w-full
          rounded-2xl
          border
          border-gray-300
          bg-white
          p-4
          text-base
          leading-7
          outline-none
          transition
          focus:border-[#891630]
          focus:ring-2
          focus:ring-[#891630]/20
        "
      />

      {error && (
        <p className="mt-2 rounded-lg border border-[#f0c6cb] bg-[#fff4f5] px-3 py-2 text-sm text-[#b3263a]">
          {error}
        </p>
      )}

      {/* 文字数 */}
      <div className="mt-2 flex justify-end">

        <span className="text-sm text-gray-400">
          {value.length} / {maxLength}文字
        </span>

      </div>

    </section>
  );
}