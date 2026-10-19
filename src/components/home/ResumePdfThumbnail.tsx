"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { resumeThumbnailCache } from "./resume-thumbnail";

export default function ResumePdfThumbnail({
  url,
  version,
  onError,
}: {
  url: string;
  version: string;
  onError: () => void;
}) {
  const [image, setImage] = useState(() => resumeThumbnailCache.peek(version));

  useEffect(() => {
    let cancelled = false;
    resumeThumbnailCache.load(url, version).then(
      (thumbnail) => {
        if (!cancelled) setImage(thumbnail);
      },
      () => {
        if (!cancelled) onError();
      }
    );
    return () => {
      cancelled = true;
    };
  }, [url, version, onError]);

  return image ? (
    <Image
      src={image.src}
      width={image.width}
      height={image.height}
      alt=""
      unoptimized
      loading="eager"
      data-thumbnail-ready="true"
    />
  ) : null;
}
