"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Technologies.module.css";

gsap.registerPlugin(ScrollTrigger);

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
  const sceneRef = useRef<HTMLElement>(null);
  const logoIdentity = technologies
    .map((technology) => technology.name)
    .join("|");
  const title = translations.home?.technologies?.title ?? "Tech Stack";
  const subtitle =
    translations.home?.technologies?.subtitle ??
    "The tools I use to build websites and apps.";
  const topCount = Math.ceil(technologies.length / 2);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const copy = scene.querySelector<HTMLElement>(`.${styles.copy}`);
    const upperLogos = scene.querySelectorAll<HTMLElement>(
      `.${styles.upperLogo}`
    );
    const lowerLogos = scene.querySelectorAll<HTMLElement>(
      `.${styles.lowerLogo}`
    );
    if (!copy) return;

    const media = gsap.matchMedia();
    const createExit = (pin: boolean) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: pin ? "top top+=64" : "bottom bottom",
          end: pin
            ? () => `+=${Math.round(scene.offsetHeight * 0.85)}`
            : "bottom top+=64",
          scrub: true,
          pin,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          upperLogos,
          {
            "--exit-x": () => `${Math.round(window.innerWidth * 0.3)}px`,
            "--exit-y": () => `${-Math.round(window.innerHeight * 0.34)}px`,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.55,
            stagger: { each: 0.012, from: "center" },
            ease: "none",
          },
          0
        )
        .to(
          lowerLogos,
          {
            "--exit-x": () => `${-Math.round(window.innerWidth * 0.3)}px`,
            "--exit-y": () => `${Math.round(window.innerHeight * 0.34)}px`,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.55,
            stagger: { each: 0.012, from: "center" },
            ease: "none",
          },
          0
        )
        .to(
          copy,
          {
            "--exit-copy-y": () =>
              `${-Math.round(window.innerHeight * 0.24)}px`,
            opacity: 0,
            filter: "blur(10px)",
            duration: 0.68,
            ease: "none",
          },
          0.08
        )
        .to(scene, { autoAlpha: 0, duration: 0.65, ease: "none" }, 0.25);
    };

    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => createExit(true)
    );
    media.add(
      "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
      () => createExit(false)
    );

    return () => media.revert();
  }, [logoIdentity]);

  return (
    <section
      ref={sceneRef}
      className={styles.scene}
      aria-labelledby="technologies-heading"
    >
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
