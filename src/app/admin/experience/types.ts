export interface LocalizedText {
  th: string;
  en: string;
  ja: string;
}

export type ExperienceType = "work" | "education";

export const ICON_OPTIONS = [
  "FaBriefcase",
  "FaLaptopCode",
  "FaGraduationCap",
  "MdWork",
  "MdRestaurant",
  "MdFastfood",
  "MdSchool",
] as const;

export type IconOption = (typeof ICON_OPTIONS)[number];

export interface ExperienceData {
  id: string;
  type: ExperienceType;
  title: LocalizedText;
  company: string;
  startDate: string; // "yyyy-MM"
  endDate: string | null; // "yyyy-MM", null = Present
  isCurrent: boolean;
  description: LocalizedText;
  skills: string[];
  icon: IconOption;
  order: number;
}
