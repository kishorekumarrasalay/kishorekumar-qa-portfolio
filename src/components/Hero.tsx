"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import SocialIcons from "./SocialIcons";
import TypewriterStatus from "./TypewriterStatus";
import RoleCycler from "./RoleCycler";
import ParallaxLayer from "./ParallaxLayer";
import MagneticButton from "./MagneticButton";
import { portfolioData } from "@/data/portfolio";

export default function Hero() {
  const { site, hero } = portfolioData;
  const reduce = useReducedMotion();

  const enter = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 };
  const visible = { opacity: 1, y: 0 };
  const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="home"
      className="hero-section relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-10 pb-16 text-center sm:px-6 sm:pt-12 sm:pb-20 lg:px-8"
    >
      <ParallaxLayer
        speed={0.15}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
      >
        <motion.div
          className="relative mb-10 h-28 w-28 overflow-hidden rounded-full border-4 border-card-border shadow-sm sm:mb-12 sm:h-36 sm:w-36 md:mb-14 md:h-44 md:w-44"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: 0 }}
        >
          <Image
            src={site.profileImage}
            alt={`${site.name} — Quality Analyst profile photo`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 144px, 176px"
          />
        </motion.div>

        <motion.h1
          className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: reduce ? 0 : 0.08 }}
        >
          {site.name}
        </motion.h1>

        <motion.div
          className="mt-3 sm:mt-4"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: reduce ? 0 : 0.16 }}
        >
          <RoleCycler />
        </motion.div>

        <motion.p
          className="mt-1.5 text-xs font-medium tracking-wide text-muted sm:text-sm"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: reduce ? 0 : 0.2 }}
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          className="mt-4 sm:mt-5"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: reduce ? 0 : 0.24 }}
        >
          <TypewriterStatus />
        </motion.div>

        <motion.p
          className="text-body mt-8 max-w-2xl px-1 text-sm leading-relaxed text-muted sm:mt-10 sm:px-2 sm:text-base sm:leading-7 md:text-lg md:leading-8"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: reduce ? 0 : 0.32 }}
        >
          {hero.bio}
        </motion.p>

        <motion.div
          className="mt-8 sm:mt-10"
          initial={enter}
          animate={visible}
          transition={{ ...transition, delay: reduce ? 0 : 0.4 }}
        >
          <SocialIcons />
        </motion.div>
      </ParallaxLayer>

      <MagneticButton
        as="a"
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-muted transition hover:text-primary-light"
        aria-label="Scroll to About section"
        strength={0.2}
      >
        <span className="text-[10px] font-medium tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown
          size={22}
          className={reduce ? "" : "hero-scroll-chevron"}
          aria-hidden
        />
      </MagneticButton>
    </section>
  );
}
