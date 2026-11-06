"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";

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
  loop: string;
  label: { x: number; y: number };
};

/** Unset until JS has decided, so a no-JS render stays fully visible. */
type FlowState = "idle" | "play" | "done";

type Props = {
  steps: readonly ProcessStep[];
  loopNote: string;
};

const DESKTOP_QUERY = "(min-width: 56rem)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** One bit per wire: five steps plus the return loop. */
const ALL_ARROWS = 0b111111;

const DESKTOP_CARD_MS = [280, 420, 560, 1360, 1500, 1640] as const;
const MOBILE_CARD_MS = [80, 200, 320, 440, 560, 680] as const;
const DESKTOP_WIRE_S = [0.75, 0.95, 2.0, 2.2, 2.4] as const;
const DRAW_S = 0.68;
const LOOP_S = 2.8;
const DONE_MS = 3800;

/** Tracks a media query without mirroring it into state from an effect. */
function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => serverValue);
}

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

function loopBetween(from: Box, to: Box): { d: string; label: { x: number; y: number } } {
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
  const loop = loopBetween(coordinate, review);
  return {
    width: origin.width,
    height: origin.height,
    segments,
    loop: desktop ? loop.d : "",
    label: loop.label,
  };
}

/** Six-step project flow with a drawn path and a return loop when scope changes. */
export function ProcessFlow({ steps, loopNote }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery(DESKTOP_QUERY, true);
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY, false);
  const [wires, setWires] = useState<Wires | null>(null);
  const [flow, setFlow] = useState<FlowState | null>(null);
  const [drawnMask, setDrawnMask] = useState(0);
  const markerId = useId().replace(/:/g, "");
  const loopNoteId = "process-loop-note";
  const cardDelays = desktop ? DESKTOP_CARD_MS : MOBILE_CARD_MS;

  // Reduced motion shows the finished diagram straight away; derive it instead of storing it.
  const phase: FlowState | null = reduceMotion ? "done" : flow;
  const arrowMask = phase === "done" ? ALL_ARROWS : drawnMask;

  // Measuring layout before paint is the one place a synchronous state update is correct.
  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const update = () => setWires(measure(board, desktop));
    update();
    const resize = new ResizeObserver(update);
    resize.observe(board);

    if (reduceMotion) {
      return () => resize.disconnect();
    }

    const section = board.closest("section") ?? board;
    const start = () => {
      setFlow((current) => (current === "done" ? current : "play"));
    };

    const rect = section.getBoundingClientRect();

    // Stacked layouts can be several screens tall, so the share of the section that
    // must be visible is capped to what a viewport can actually show.
    const threshold = Math.min(0.16, (window.innerHeight * 0.3) / Math.max(rect.height, 1));
    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        start();
        reveal.disconnect();
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      start();
    } else {
      // Keep any progress already made if this effect re-runs after a breakpoint change.
      setFlow((current) => current ?? "idle");
      reveal.observe(section);
    }

    return () => {
      resize.disconnect();
      reveal.disconnect();
    };
  }, [desktop, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || flow !== "play" || !desktop) return;

    const timers = DESKTOP_WIRE_S.map((start, index) =>
      window.setTimeout(() => {
        setDrawnMask((mask) => mask | (1 << index));
      }, (start + DRAW_S) * 1000),
    );
    timers.push(
      window.setTimeout(() => {
        setDrawnMask((mask) => mask | (1 << 5));
      }, (LOOP_S + DRAW_S) * 1000),
    );
    timers.push(
      window.setTimeout(() => {
        setFlow("done");
      }, DONE_MS),
    );

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [flow, reduceMotion, desktop]);

  return (
    <div ref={boardRef} className={styles.board} {...(phase ? { "data-flow": phase } : {})}>
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
            key={index}
            d={d}
            className={styles.wire}
            markerEnd={arrowMask & (1 << index) ? `url(#${markerId})` : undefined}
            pathLength={1}
            style={{ animationDelay: `${DESKTOP_WIRE_S[index] ?? 0}s` }}
          />
        ))}
        {wires?.loop && (
          <path
            d={wires.loop}
            className={styles.loopWire}
            markerEnd={arrowMask & (1 << 5) ? `url(#${markerId})` : undefined}
            pathLength={1}
            style={{ animationDelay: `${LOOP_S}s` }}
          />
        )}
      </svg>

      <p id={loopNoteId} className="visually-hidden">
        {loopNote}, work returns to review the scope.
      </p>
      <ol className={styles.steps} aria-describedby={loopNoteId}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={styles.step}
            style={{ "--flow-delay": `${cardDelays[index]}ms` } as CSSProperties}
          >
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
          </li>
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
