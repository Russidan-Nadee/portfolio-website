"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { isOptimizableImage } from "@/lib/optimizable-image";

type OptimizedImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
};

export default function OptimizedImage({
  src,
  alt,
  onError,
  ...props
}: OptimizedImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const useOriginal = failedSource === src;

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={useOriginal || !isOptimizableImage(src)}
      onError={(event) => {
        if (!useOriginal && isOptimizableImage(src)) {
          setFailedSource(src);
        } else {
          onError?.(event);
        }
      }}
    />
  );
}
