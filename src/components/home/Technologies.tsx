"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./Technologies.module.css";

export interface TechnologyItem {
  name: string;
  icon: string;
}

interface TechnologiesProps {
  translations: {
    home?: {
      technologies?: {
        title?: string;
        subtitle?: string;
      };
    };
  };
  technologies: TechnologyItem[];
}

type LogoMotion = CSSProperties & {
  "--orbit-delay": string;
  "--orbit-mobile-delay": string;
  "--float-delay": string;
  "--rest-x": string;
  "--rest-y": string;
  "--rest-scale": string;
  "--rest-mobile-scale": string;
};

const darkLogos = new Set([
  "Express",
  "GitHub",
  "Next.js",
  "Prisma",
  "Railway",
  "Vercel",
]);

function getLogoMotion(
  index: number,
  count: number,
  lowerArc: boolean
): LogoMotion {
  const progress = (index + 0.5) / count;
  const depth = Math.sin(Math.PI * progress);

  return {
    "--orbit-delay": `${(-34 * progress).toFixed(3)}s`,
    "--orbit-mobile-delay": `${(-22 * progress).toFixed(3)}s`,
    "--float-delay": `${(-(index % 7) * 0.48).toFixed(2)}s`,
    "--rest-x": `${(progress * 100).toFixed(3)}%`,
    "--rest-y": `${(lowerArc ? 88 - depth * 25 : 12 + depth * 25).toFixed(3)}%`,
    "--rest-scale": (1.6 - depth * 0.95).toFixed(3),
    "--rest-mobile-scale": (1.2 - depth * 0.68).toFixed(3),
  };
}

export default function Technologies({
  translations,
  technologies,
}: TechnologiesProps) {
  const title =
    translations.home?.technologies?.title ?? "Technologies I Work With";
  const subtitle =
    translations.home?.technologies?.subtitle ??
    "Modern tools for modern solutions";
  const topCount = Math.ceil(technologies.length / 2);

  return (
    <section className={styles.scene} aria-labelledby="technologies-heading">
      <div className={styles.copy}>
        <h2 id="technologies-heading" className={styles.title}>
          {title}
        </h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <ul className={styles.logoField} aria-label={title}>
        {technologies.map((technology, index) => {
          const lowerArc = index >= topCount;
          const arcIndex = lowerArc ? index - topCount : index;
          const arcCount = lowerArc ? technologies.length - topCount : topCount;

          return (
            <li
              key={`${technology.name}-${index}`}
              className={`${styles.logo} ${lowerArc ? styles.lowerLogo : styles.upperLogo}`}
              style={getLogoMotion(arcIndex, arcCount, lowerArc)}
              title={technology.name}
            >
              <Image
                src={technology.icon}
                alt={technology.name}
                width={160}
                height={160}
                unoptimized
                loading="eager"
                className={`${styles.icon} ${darkLogos.has(technology.name) ? styles.monochromeIcon : ""}`}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
