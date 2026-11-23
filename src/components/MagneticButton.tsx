"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a" | "div";
  href?: string;
  download?: boolean | string;
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
  strength?: number;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  className = "",
  as = "button",
  href,
  download,
  type = "button",
  onClick,
  strength = 0.35,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * strength, y: y * strength });
  };

  const onLeave = () => setOffset({ x: 0, y: 0 });

  const style: CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: "transform 0.18s ease-out",
  };

  const shared = {
    ref: ref as never,
    className: `magnetic-btn inline-flex ${className}`,
    style,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    ...rest,
  };

  if (as === "a" && href) {
    return (
      <a href={href} download={download || undefined} {...shared}>
        {children}
      </a>
    );
  }

  if (as === "div") {
    return <div {...shared}>{children}</div>;
  }

  return (
    <button type={type} {...shared}>
      {children}
    </button>
  );
}
