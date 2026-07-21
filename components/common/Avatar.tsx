"use client";

import Image from "next/image";

type AvatarProps = {
  src?: string; 
  alt: string;
  size?: number;
};

export default function Avatar({
  src,
  alt,
  size = 56,
}: AvatarProps) {
  const imageSrc = src && src.trim() !== "" ? src : "/images/profile/profile01.png";

  return (
    <div
      className="flex items-center justify-center rounded-full border-4 border-[#F6DDE3] bg-white"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={imageSrc} 
        alt={alt}
        width={size * 0.95}
        height={size * 0.95}
        className="object-contain"
      />
    </div>
  );
}