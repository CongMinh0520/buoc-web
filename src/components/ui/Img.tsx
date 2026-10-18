"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Ảnh phủ kín khung cha (khung cha cần `relative` + kích thước).
 * Nếu ảnh lỗi/không tải được → hiện khối placeholder trung tính, layout không vỡ.
 */
export function Img({ src, alt, sizes = "100vw", priority, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-[linear-gradient(135deg,#ece8e1,#d9d3c9)]"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
