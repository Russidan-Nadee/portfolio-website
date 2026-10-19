export type ResumeThumbnail = { src: string; width: number; height: number };

/** Retain only the latest version; share in-flight work with hover and preload. */
export function createResumeThumbnailCache(
  render: (url: string) => Promise<ResumeThumbnail>
) {
  type Entry = {
    version: string;
    promise: Promise<ResumeThumbnail>;
    image?: ResumeThumbnail;
  };
  let current: Entry | undefined;

  return {
    peek(version: string) {
      return current?.version === version ? current.image : undefined;
    },
    load(url: string, version: string): Promise<ResumeThumbnail> {
      if (current?.version === version) return current.promise;
      const entry: Entry = {
        version,
        promise: Promise.resolve()
          .then(() => render(url))
          .then(
            (image) => {
              entry.image = image;
              return image;
            },
            (error: unknown) => {
              if (current === entry) current = undefined;
              throw error;
            }
          ),
      };
      current = entry;
      return entry.promise;
    },
  };
}
