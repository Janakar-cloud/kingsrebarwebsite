"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import type { ImageAsset } from "@/content/types";
import styles from "./ProcessFlow.module.css";

export type ProcessStep = {
  title: string;
  detail: string;
  image: ImageAsset;
};

type Box = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  cx: number;
  cy: number;
  iy: number;
};

type Wires = {
  width: number;
  height: number;
  segments: string[];
  travel: string;
  loop: string;
  label: { x: number; y: number };
};

type Props = {
  steps: readonly ProcessStep[];
  loopNote: string;
};

function boxOf(el: Element, origin: DOMRect): Box {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left - origin.left,
    top: rect.top - origin.top,
    right: rect.right - origin.left,
    bottom: rect.bottom - origin.top,
    cx: rect.left + rect.width / 2 - origin.left,
    cy: rect.top + rect.height / 2 - origin.top,
    iy: rect.top + Math.min(rect.height * 0.34, 140) - origin.top,
  };
}

function segment(from: Box, to: Box): string {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  if (Math.abs(dx) > Math.abs(dy)) {
    const startX = dx > 0 ? from.right : from.left;
    const endX = dx > 0 ? to.left : to.right;
    const mid = (startX + endX) / 2;
    return `M ${startX.toFixed(1)} ${from.iy.toFixed(1)} C ${mid.toFixed(1)} ${from.iy.toFixed(1)}, ${mid.toFixed(1)} ${to.iy.toFixed(1)}, ${endX.toFixed(1)} ${to.iy.toFixed(1)}`;
  }
  const startY = dy > 0 ? from.bottom : from.top;
  const endY = dy > 0 ? to.top : to.bottom;
  const mid = (startY + endY) / 2;
  return `M ${from.cx.toFixed(1)} ${startY.toFixed(1)} C ${from.cx.toFixed(1)} ${mid.toFixed(1)}, ${to.cx.toFixed(1)} ${mid.toFixed(1)}, ${to.cx.toFixed(1)} ${endY.toFixed(1)}`;
}

function loopBetween(from: Box, to: Box, mobile: boolean): { d: string; label: { x: number; y: number } } {
  if (mobile) {
    const start = { x: from.left, y: from.cy };
    const end = { x: to.left, y: to.cy };
    const bowX = Math.max(10, Math.min(start.x, end.x) - 22);
    const midY = (start.y + end.y) / 2;
    return {
      d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${bowX.toFixed(1)} ${start.y.toFixed(1)}, ${bowX.toFixed(1)} ${end.y.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
      label: { x: bowX, y: midY },
    };
  }
  const start = { x: from.cx, y: from.top + 2 };
  const end = { x: to.cx, y: to.bottom - 2 };
  const midY = (start.y + end.y) / 2;
  return {
    d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${start.x.toFixed(1)} ${midY.toFixed(1)}, ${end.x.toFixed(1)} ${midY.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
    label: { x: start.x, y: midY },
  };
}

function measure(board: HTMLElement, desktop: boolean): Wires | null {
  const cards = [...board.querySelectorAll<HTMLElement>("[data-step]")];
  if (cards.length < 2) return null;
  const origin = board.getBoundingClientRect();
  const boxes = cards.map((card) => boxOf(card, origin));
  const segments = boxes.slice(0, -1).map((current, index) => segment(current, boxes[index + 1]!));
  const review = boxes[1];
  const coordinate = boxes[4];
  if (!review || !coordinate) return null;
  const loop = loopBetween(coordinate, review, !desktop);
  return {
    width: origin.width,
    height: origin.height,
    segments,
    travel: segments.join(" "),
    loop: desktop ? loop.d : "",
    label: loop.label,
  };
}

/** Six-step project flow with a drawn path and a return loop when scope changes. */
export function ProcessFlow({ steps, loopNote }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [wires, setWires] = useState<Wires | null>(null);
  const [armed, setArmed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const markerId = useId().replace(/:/g, "");
  const loopNoteId = "process-loop-note";

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const desktopQuery = window.matchMedia("(min-width: 56rem)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(reduced.matches);

    const update = () => {
      setWires(measure(board, desktopQuery.matches));
    };

    update();
    const resize = new ResizeObserver(update);
    resize.observe(board);
    desktopQuery.addEventListener("change", update);

    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setArmed(true);
        update();
        reveal.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    reveal.observe(board);

    return () => {
      resize.disconnect();
      desktopQuery.removeEventListener("change", update);
      reveal.disconnect();
    };
  }, []);

  return (
    <div ref={boardRef} className={styles.board} data-wires={armed ? "ready" : "idle"}>
      <svg
        className={styles.wires}
        viewBox={wires ? `0 0 ${wires.width} ${wires.height}` : "0 0 1 1"}
        aria-hidden="true"
      >
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 1.2 L 10 5 L 0 8.8 Z" fill="currentColor" />
          </marker>
        </defs>
        {wires?.segments.map((d, index) => (
          <path
            key={d}
            d={d}
            className={styles.wire}
            markerEnd={`url(#${markerId})`}
            pathLength={1}
            style={{ animationDelay: `${0.12 + index * 0.16}s` }}
          />
        ))}
        {wires?.loop && (
          <path
            d={wires.loop}
            className={styles.loopWire}
            markerEnd={`url(#${markerId})`}
            pathLength={1}
            style={{ animationDelay: "1.05s" }}
          />
        )}
        {wires && armed && !reduceMotion && (
          <circle className={styles.tracer} r="4" cx="0" cy="0">
            <animateMotion dur="7.5s" repeatCount="indefinite" rotate="auto" path={wires.travel} />
          </circle>
        )}
      </svg>

      <p id={loopNoteId} className="visually-hidden">
        {loopNote}, work returns to review the scope.
      </p>
      <ol className={styles.steps} aria-describedby={loopNoteId}>
        {steps.map((step, index) => (
          <Reveal as="li" key={step.title} index={index} className={styles.step}>
            <article data-step={index + 1} className={styles.card}>
              <div className={styles.frame}>
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  width={step.image.width}
                  height={step.image.height}
                  sizes="(min-width: 72rem) 22vw, (min-width: 56rem) 30vw, 92vw"
                  className={styles.photo}
                />
              </div>
              <div className={styles.meta}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.detail}>{step.detail}</p>
              </div>
            </article>
            {index === 4 && <p className={styles.loopCallout}>{loopNote}</p>}
          </Reveal>
        ))}
      </ol>

      <p
        className={styles.loopNote}
        hidden={!wires?.loop}
        style={wires?.loop ? { left: wires.label.x, top: wires.label.y } : undefined}
      >
        {loopNote}
      </p>
    </div>
  );
}
