"use client";

import { useState, type ReactNode } from "react";
import type { ImageProps } from "next/image";
import OptimizedImage from "@/components/ui/OptimizedImage";

type ProjectImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src: string;
  alt: string;
  fallback: ReactNode;
};

export default function ProjectImage({
  src,
  alt,
  fallback,
  ...props
}: ProjectImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (!src || failedSource === src) return <>{fallback}</>;

  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      onError={() => setFailedSource(src)}
    />
  );
}
