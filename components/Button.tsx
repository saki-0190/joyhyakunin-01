type ButtonProps = {
  text: string;
  onClick?: () => void;
};

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-orange-500
        hover:bg-orange-600
        text-white
        font-bold
        py-3
        px-6
        rounded-xl
        shadow-md
        transition
      "
    >
      {text}
    </button>
  );
}