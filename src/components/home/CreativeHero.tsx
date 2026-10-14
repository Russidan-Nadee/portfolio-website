"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ProjectData } from "@/app/admin/projects/types";
import styles from "./CreativeHero.module.css";

gsap.registerPlugin(ScrollTrigger);

type HeroLocale = "th" | "en" | "ja";

interface HeroTranslations {
  home?: {
    intro?: string;
    title?: string;
    subtitle?: string;
    buttons?: {
      portfolio?: string;
      contact?: string;
    };
  };
}

export interface HeroCertificateData {
  id: string;
  title: { th: string; en: string; ja: string };
  imageUrl: string;
  pdfUrl: string;
  issuer: string;
}

export type HeroProjectData = Pick<
  ProjectData,
  "id" | "slug" | "title" | "thumbnailUrl" | "techSummary"
>;

interface CreativeHeroProps {
  translations?: HeroTranslations;
  projects?: HeroProjectData[];
  certificates?: HeroCertificateData[];
  locale?: HeroLocale;
}

interface HeroCard {
  kind: "project" | "certificate";
  id: string;
  href: string;
  title: string;
  imageUrl: string;
  meta: string;
}

const cardSlots = [
  styles.cardSlot1,
  styles.cardSlot2,
  styles.cardSlot3,
  styles.cardSlot4,
  styles.cardSlot5,
  styles.cardSlot6,
  styles.cardSlot7,
  styles.cardSlot8,
  styles.cardSlot9,
  styles.cardSlot10,
];

const deckPattern: HeroCard["kind"][] = [
  "project",
  "project",
  "certificate",
  "certificate",
  "project",
  "project",
  "certificate",
  "certificate",
  "project",
  "project",
];

const cardLabels: Record<HeroLocale, Record<HeroCard["kind"], string>> = {
  th: {
    project: "\u0e42\u0e1b\u0e23\u0e40\u0e08\u0e01\u0e15\u0e4c",
    certificate: "\u0e43\u0e1a\u0e23\u0e31\u0e1a\u0e23\u0e2d\u0e07",
  },
  en: { project: "Project", certificate: "Certificate" },
  ja: {
    project: "\u30d7\u30ed\u30b8\u30a7\u30af\u30c8",
    certificate: "\u8a3c\u660e\u66f8",
  },
};

export default function CreativeHero({
  translations,
  projects = [],
  certificates = [],
  locale = "en",
}: CreativeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const activeLocale: HeroLocale =
    locale === "th" || locale === "ja" ? locale : "en";
  const projectQueue: HeroCard[] = projects.slice(0, 6).map((project) => ({
    kind: "project",
    id: project.id || project.slug,
    href: `/portfolio/${project.slug}`,
    title: project.title[activeLocale] || project.title.en,
    imageUrl: project.thumbnailUrl,
    meta: project.techSummary,
  }));
  const certificateQueue: HeroCard[] = certificates
    .slice(0, 4)
    .map((certificate) => ({
      kind: "certificate",
      id: certificate.id,
      href: certificate.pdfUrl,
      title: certificate.title[activeLocale] || certificate.title.en,
      imageUrl: certificate.imageUrl,
      meta: certificate.issuer,
    }));
  const cards = deckPattern.flatMap((kind) => {
    const card =
      kind === "project" ? projectQueue.shift() : certificateQueue.shift();
    return card ? [card] : [];
  });
  const cardIdentity = cards.map((card) => `${card.kind}:${card.id}`).join("|");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1200px) and (prefers-reduced-motion: no-preference)",
      () => {
        const content = hero.querySelector<HTMLElement>(`.${styles.content}`);
        const orbit = hero.querySelector<HTMLElement>(`.${styles.orbit}`);
        if (!content || !orbit) return;

        const cards = hero.querySelectorAll<HTMLElement>("[data-exit-side]");
        const exitDistance = () => Math.max(window.innerWidth * 0.75, 700);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top+=64",
            end: () => `+=${hero.offsetHeight}`,
            scrub: true,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              hero.inert = progress >= 0.7;
            },
          },
        });

        cards.forEach((card) => {
          const horizontalDirection = card.dataset.exitSide === "left" ? -1 : 1;
          const finalY = Number.parseFloat(
            getComputedStyle(card).getPropertyValue("--final-y")
          );

          timeline.to(
            card,
            {
              "--exit-x": () => `${horizontalDirection * exitDistance()}px`,
              "--exit-card-y": () =>
                `${Math.round((finalY / 100) * window.innerHeight * 1.4)}px`,
              "--exit-scale": 1.14,
              duration: 0.8,
              ease: "none",
            },
            0
          );
        });

        timeline
          .to(
            content,
            {
              "--exit-y": () =>
                `${-Math.min(window.innerHeight * 0.28, 260)}px`,
              filter: "blur(10px)",
              duration: 0.78,
              ease: "none",
            },
            0.04
          )
          .to(orbit, { filter: "blur(8px)", duration: 0.7, ease: "none" }, 0.12)
          .to(hero, { autoAlpha: 0, duration: 0.65, ease: "none" }, 0.35);

        return () => {
          hero.inert = false;
        };
      }
    );

    return () => {
      hero.inert = false;
      media.revert();
    };
  }, [cardIdentity]);

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="home-hero-title"
    >
      <div
        className={`${styles.content} ${cards.length > 0 ? styles.contentAnimated : ""}`}
      >
        <p className={styles.eyebrow}>
          {translations?.home?.intro ||
            "Russidan Nadee | Web & Mobile Developer"}
        </p>
        <h1 className={styles.title} id="home-hero-title">
          {translations?.home?.title ||
            "Websites and apps, built around your idea"}
        </h1>
        <p className={styles.subtitle}>
          {translations?.home?.subtitle ||
            "I build useful websites and mobile apps that bring your ideas to life."}
        </p>
        <div className={styles.actions}>
          <Link href="/portfolio" className={styles.primaryAction}>
            {translations?.home?.buttons?.portfolio || "View projects"}
          </Link>
          <Link href="/contact" className={styles.secondaryAction}>
            {translations?.home?.buttons?.contact || "Get in touch"}
          </Link>
        </div>
      </div>

      {cards.length > 0 && (
        <div className={styles.orbit}>
          {cards.map((card, index) => {
            const slotIndex = Math.round(
              (index * cardSlots.length) / cards.length
            );
            const slot = cardSlots[slotIndex];
            const className = `${styles.card} ${slot} ${card.kind === "project" ? styles.projectCard : styles.certificateCard}`;
            const label = cardLabels[activeLocale][card.kind];
            const exitSide = slotIndex % 2 === 0 ? "left" : "right";
            const cardContents = (
              <>
                <span className={styles.cardImage}>
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 1199px) 220px, 210px"
                      className={styles.projectImage}
                    />
                  ) : (
                    <span className={styles.imageFallback} aria-hidden="true">
                      {card.title.slice(0, 1)}
                    </span>
                  )}
                </span>
                <span className={styles.cardDetails}>
                  <strong className={styles.cardTitle}>{card.title}</strong>
                  {card.meta && (
                    <span className={styles.cardMeta}>{card.meta}</span>
                  )}
                </span>
              </>
            );

            return card.kind === "certificate" ? (
              <a
                key={`${card.kind}-${card.id}`}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                data-exit-side={exitSide}
                aria-label={`${label}: ${card.title} (PDF)`}
              >
                {cardContents}
              </a>
            ) : (
              <Link
                key={`${card.kind}-${card.id}`}
                href={card.href}
                className={className}
                data-exit-side={exitSide}
                aria-label={`${label}: ${card.title}`}
              >
                {cardContents}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
