"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { localizedPath } from "@/lib/locale-path";
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

const HERO_INTRO_COMPLETE_EVENT = "creativeHeroIntroComplete";

export default function CreativeHero({
  translations,
  projects = [],
  certificates = [],
  locale = "en",
}: CreativeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const completedCardsRef = useRef<Set<EventTarget>>(new Set());
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
    completedCardsRef.current.clear();

    if (cards.length === 0 && heroRef.current) {
      heroRef.current.dataset.introComplete = "true";
      window.dispatchEvent(new Event(HERO_INTRO_COMPLETE_EVENT));
    }
  }, [cardIdentity, cards.length]);

  useEffect(() => {
    const hero = heroRef.current;
    const orbit = hero?.querySelector<HTMLElement>(`.${styles.orbit}`);
    if (!hero || !orbit) return;

    const images = Array.from(orbit.querySelectorAll("img"));
    const pendingImages = new Set(images);

    const finishIntro = () => {
      if (pendingImages.size > 0 || hero.dataset.introFinishing === "true") {
        return;
      }

      const transform = getComputedStyle(orbit).transform;
      const matrix = new DOMMatrixReadOnly(
        transform === "none" ? undefined : transform
      );
      const angle = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
      const startAngle = (angle + 360) % 360;
      const reverseAngle = startAngle - 45;
      const finishDuration = 0.3 + (1080 - reverseAngle) / 1275;

      hero.style.setProperty("--orbit-start-angle", `${startAngle}deg`);
      hero.style.setProperty("--orbit-reverse-angle", `${reverseAngle}deg`);
      hero.style.setProperty("--finish-duration", `${finishDuration}s`);
      hero.dataset.introFinishing = "true";
    };

    const markImageReady = (event: Event) => {
      pendingImages.delete(event.currentTarget as HTMLImageElement);
      finishIntro();
    };

    images.forEach((image) => {
      image.addEventListener("load", markImageReady);
      image.addEventListener("error", markImageReady);
      if (image.complete) pendingImages.delete(image);
    });
    finishIntro();

    return () => {
      images.forEach((image) => {
        image.removeEventListener("load", markImageReady);
        image.removeEventListener("error", markImageReady);
      });
    };
  }, [cardIdentity]);

  const handleCardAnimationEnd = (
    event: React.AnimationEvent<HTMLDivElement>
  ) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.matches("[data-exit-side]")) return;

    completedCardsRef.current.add(event.target);
    if (completedCardsRef.current.size !== cards.length) return;

    const hero = heroRef.current;
    if (!hero || hero.dataset.introComplete === "true") return;

    hero.dataset.introComplete = "true";
    window.dispatchEvent(new Event(HERO_INTRO_COMPLETE_EVENT));
  };

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
      data-creative-hero
    >
      <div
        className={`${styles.content} ${cards.length > 0 ? styles.contentAnimated : ""}`}
      >
        <p className={styles.eyebrow}>
          {translations?.home?.intro || "Russidan Nadee | Full Stack Developer"}
        </p>
        <h1 className={styles.title} id="home-hero-title">
          {translations?.home?.title || "From your idea\nto a real product."}
        </h1>
        <p className={styles.subtitle}>
          {translations?.home?.subtitle ||
            "Building web apps in the AI era, from the interface to the back end."}
        </p>
        <div className={styles.actions}>
          <Link
            href={localizedPath("/portfolio", activeLocale)}
            className={styles.primaryAction}
          >
            {translations?.home?.buttons?.portfolio || "View projects"}
          </Link>
          <Link
            href={localizedPath("/contact", activeLocale)}
            className={styles.secondaryAction}
          >
            {translations?.home?.buttons?.contact || "Get in touch"}
          </Link>
        </div>
      </div>

      {cards.length > 0 && (
        <div className={styles.orbit} onAnimationEnd={handleCardAnimationEnd}>
          {cards.map((card, index) => {
            const slotIndex = Math.round(
              (index * cardSlots.length) / cards.length
            );
            const slot = cardSlots[slotIndex];
            const className = `${styles.card} ${card.kind === "project" ? styles.projectCard : styles.certificateCard}`;
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

            return (
              <div
                key={`${card.kind}-${card.id}`}
                className={`${styles.orbitTrack} ${slot}`}
              >
                {card.kind === "certificate" ? (
                  <a
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
                    href={localizedPath(card.href, activeLocale)}
                    className={className}
                    data-exit-side={exitSide}
                    aria-label={`${label}: ${card.title}`}
                  >
                    {cardContents}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
