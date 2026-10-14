import type {
  CertificateCategory,
  LocalizedText,
} from "../src/features/certificates/types";

export interface CertificateManifestItem {
  sourceFilename: string;
  previewPath: string;
  slug: string;
  order: number;
  title: LocalizedText;
  issuer: string;
  issuedAt: string | null;
  category: CertificateCategory;
}

export const CERTIFICATE_MANIFEST: CertificateManifestItem[] = [
  {
    sourceFilename: "certificates_futureskill_growth-mindset.pdf",
    previewPath: "previews/growth-mindset.png",
    slug: "growth-mindset",
    order: 0,
    title: {
      th: "เพิ่มประสิทธิภาพในการพัฒนาคนด้วย Growth Mindset",
      en: "Developing People Effectively with a Growth Mindset",
      ja: "グロースマインドセットによる人材育成",
    },
    issuer: "FutureSkill",
    issuedAt: "2026-08-13",
    category: "professional",
  },
  {
    sourceFilename: "certificates_set_เงินทองต้องวางแผน.pdf",
    previewPath: "previews/money-planning.png",
    slug: "money-planning",
    order: 1,
    title: {
      th: "เงินทองต้องวางแผน",
      en: "Money Planning Essentials",
      ja: "マネープランニング入門",
    },
    issuer: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET)",
    issuedAt: "2025-05-20",
    category: "finance",
  },
  {
    sourceFilename:
      "certificates_พระนครเหนือ-มจพ_การเขียนภาษาไพธอน-ระดับเบื้องต้น.pdf",
    previewPath: "previews/python-fundamentals.png",
    slug: "python-fundamentals",
    order: 2,
    title: {
      th: "การเขียนภาษาไพธอน ระดับเบื้องต้น",
      en: "Python Programming - Beginner Level",
      ja: "Pythonプログラミング - 初級",
    },
    issuer: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
    issuedAt: null,
    category: "development",
  },
  {
    sourceFilename:
      "certificates_พระนครเหนือ-มจพ_การเขียนโปรแกรมควบคุมแขนกลอุตสาหกรรมด้วยเทคโนโลยีคู่เสมือนดิจิทัลทางไกล-แขนกลระดับสูง.pdf",
    previewPath: "previews/industrial-robot-digital-twin.png",
    slug: "industrial-robot-digital-twin",
    order: 3,
    title: {
      th: "การเขียนโปรแกรมควบคุมแขนกลอุตสาหกรรมด้วยเทคโนโลยีคู่เสมือนดิจิทัลทางไกล - ระดับสูง",
      en: "Remote Digital Twin Programming for Industrial Robot Control - Advanced",
      ja: "遠隔デジタルツインによる産業用ロボット制御プログラミング - 上級",
    },
    issuer: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
    issuedAt: null,
    category: "technology",
  },
  {
    sourceFilename: "certificates_futureskill_microservices.pdf",
    previewPath: "previews/microservices.png",
    slug: "microservices",
    order: 4,
    title: {
      th: "พัฒนาซอฟต์แวร์ระบบ Microservices อย่างเข้าใจและทำงานได้จริง ให้พร้อมประยุกต์ใช้งาน",
      en: "Understand and Build Practical Microservices Software for Real-World Use",
      ja: "マイクロサービスを理解し、実践・応用するソフトウェア開発",
    },
    issuer: "FutureSkill",
    issuedAt: "2026-09-09",
    category: "development",
  },
];
