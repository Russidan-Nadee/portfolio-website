export interface LocalizedText {
  th: string;
  en: string;
  ja: string;
}

export interface LocalizedList {
  th: string[];
  en: string[];
  ja: string[];
}

export const FILTER_TAG_OPTIONS = [
  "web",
  "crossplatform",
  "mobile",
  "desktop",
  "backend",
] as const;

export type FilterTag = (typeof FILTER_TAG_OPTIONS)[number];

export interface Card {
  title: LocalizedText;
  description: LocalizedText;
}

export interface DetailItem {
  key: string;
  value: LocalizedText;
}

export interface GalleryImage {
  url: string;
  alt: LocalizedText;
}

export interface FutureGoal {
  description: LocalizedText;
}

export interface ProjectContent {
  overview: {
    about: {
      paragraphs: LocalizedList;
    };
    objectives: {
      content: LocalizedText;
    };
  };
  features: Card[];
  gallery: GalleryImage[];
  technical: {
    details: DetailItem[];
    challenges: Card[];
  };
  results: Card[];
  futureGoals: FutureGoal[];
}

export interface ProjectData {
  id: string;
  slug: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  tags: LocalizedList;
  filterTags: FilterTag[];
  techSummary: string;
  thumbnailUrl: string;
  overviewImageUrl: string;
  overviewImageAlt: LocalizedText;
  repoUrl: string | null;
  demoUrl: string | null;
  liveUrl: string | null;
  duration: LocalizedText;
  status: LocalizedText;
  company: string;
  technologies: string[];
  content: ProjectContent;
  featured: boolean;
}

export const blankLocalizedText = (): LocalizedText => ({
  th: "",
  en: "",
  ja: "",
});
export const blankLocalizedList = (): LocalizedList => ({
  th: [],
  en: [],
  ja: [],
});

export const blankContent = (): ProjectContent => ({
  overview: {
    about: { paragraphs: blankLocalizedList() },
    objectives: { content: blankLocalizedText() },
  },
  features: [],
  gallery: [],
  technical: { details: [], challenges: [] },
  results: [],
  futureGoals: [],
});
