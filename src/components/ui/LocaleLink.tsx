"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocalePath } from "@/components/providers/LocaleProvider";

/** next/link tự thêm tiền tố ngôn ngữ (/en/…) cho đường dẫn nội bộ. Dùng thay cho Link trong website. */
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const to = useLocalePath();
  return <Link href={typeof href === "string" ? to(href) : href} {...props} />;
}

export default LocaleLink;
