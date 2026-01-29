"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BUBBLE_SIZE = 120;

const initialBubbles = [
  {
    id: "about",
    label: "About",
    link: "/about",
    x: 560,
    y: 120,
    vx: 0.5,
    vy: 0.3,
    icon: "user",
  },
  {
    id: "projects",
    label: "Projects",
    link: "/projects",
    x: 520,
    y: 260,
    vx: -0.4,
    vy: 0.6,
    icon: "grid",
  },
  {
    id: "blog",
    label: "Blog",
    link: "/blog",
    x: 420,
    y: 190,
    vx: 0.3,
    vy: -0.5,
    icon: "doc",
  },
];

function BubbleIcon({ type }) {
  if (type === "user") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="7.8" r="3.4" />
        <path d="M6 20c.8-2.8 3-4.6 6-4.6s5.2 1.8 6 4.6" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 8.5h8" />
      <path d="M8 12h5.5" />
      <path d="M8 15.5h4" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [bubbles, setBubbles] = useState(initialBubbles);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const draggingRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const pointerDownRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Center bubbles on first layout and give them an initial push outward
  useEffect(() => {
    if (!bounds.width || !bounds.height || initializedRef.current) return;
    initializedRef.current = true;

    const centerX = bounds.width / 2 - BUBBLE_SIZE / 2;
    const centerY = bounds.height / 2 - BUBBLE_SIZE / 2;

    setBubbles((prev) =>
      prev.map((b) => {
        const angle = Math.random() * Math.PI * 2;
        const initialSpeed = 0.5; // stronger push at start
        return {
          ...b,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * initialSpeed,
          vy: Math.sin(angle) * initialSpeed,
        };
      }),
    );
  }, [bounds]);

  useEffect(() => {
    const handleMove = (event) => {
      const id = draggingRef.current;
      if (!id) return;
      const now = performance.now();
      const { x: offX, y: offY } = dragOffsetRef.current;
      const x = event.clientX - offX;
      const y = event.clientY - offY;

      setBubbles((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                x,
                y,
                vx:
                  lastPointerRef.current.t !== 0
                    ? (event.clientX - lastPointerRef.current.x) /
                      Math.max(now - lastPointerRef.current.t, 1)
                    : 0,
                vy:
                  lastPointerRef.current.t !== 0
                    ? (event.clientY - lastPointerRef.current.y) /
                      Math.max(now - lastPointerRef.current.t, 1)
                    : 0,
              }
            : b,
        ),
      );

      lastPointerRef.current = { x: event.clientX, y: event.clientY, t: now };
    };

    const handleUp = () => {
      const id = draggingRef.current;
      draggingRef.current = null;

      if (!id) return;

      const start = pointerDownRef.current;
      const end = lastPointerRef.current;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);

      // Treat as a click if the pointer didn't move much
      if (dist < 6) {
        const target = initialBubbles.find((b) => b.id === id);
        if (target?.link) {
          router.push(target.link);
        }
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  useEffect(() => {
    let frame;

    const step = () => {
      setBubbles((prev) => {
        if (!bounds.width || !bounds.height) return prev;

        const padding = 8;
        const minX = padding;
        const minY = padding;
        const maxX = Math.max(bounds.width - BUBBLE_SIZE - padding, minX);
        const maxY = Math.max(bounds.height - BUBBLE_SIZE - padding, minY);

        // First, move each bubble and handle wall bounces
        const next = prev.map((b) => {
          if (draggingRef.current === b.id) return { ...b };

          let { x, y, vx, vy } = b;
          x += vx * 3;
          y += vy * 3;

          let speed = Math.hypot(vx, vy);

          // Gentle damping so initial strong push eases down over time
          const targetSpeed = 0.22;
          const damping = 0.99;
          if (speed > targetSpeed) {
            vx *= damping;
            vy *= damping;
            speed *= damping;
          }

          // Keep them from ever fully stopping
          if (speed < 0.008) {
            const angle = Math.random() * Math.PI * 2;
            vx = Math.cos(angle) * targetSpeed;
            vy = Math.sin(angle) * targetSpeed;
          }

          if (x < minX) {
            x = minX;
            vx *= -1;
          } else if (x > maxX) {
            x = maxX;
            vx *= -1;
          }

          if (y < minY) {
            y = minY;
            vy *= -1;
          } else if (y > maxY) {
            y = maxY;
            vy *= -1;
          }

          return { ...b, x, y, vx, vy };
        });

        // Then resolve simple collisions between bubbles so they don't overlap
        const minDist = BUBBLE_SIZE;
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const c = next[j];

            // Don't push around a bubble that is currently being dragged
            if (draggingRef.current === a.id || draggingRef.current === c.id) {
              continue;
            }

            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const dist = Math.hypot(dx, dy);

            if (dist === 0 || dist >= minDist) continue;

            const overlap = minDist - dist;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);

            // Push them apart equally along the collision normal
            a.x -= (nx * overlap) / 2;
            a.y -= (ny * overlap) / 2;
            c.x += (nx * overlap) / 2;
            c.y += (ny * overlap) / 2;

            // Keep inside bounds after separation
            a.x = Math.min(maxX, Math.max(minX, a.x));
            a.y = Math.min(maxY, Math.max(minY, a.y));
            c.x = Math.min(maxX, Math.max(minX, c.x));
            c.y = Math.min(maxY, Math.max(minY, c.y));

            // Simple velocity exchange for a bouncy feel
            const avx = a.vx;
            const avy = a.vy;
            a.vx = c.vx;
            a.vy = c.vy;
            c.vx = avx;
            c.vy = avy;
          }
        }

        return next;
      });

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [bounds]);

  const handlePointerDown = (event, id) => {
    const rect = event.currentTarget.getBoundingClientRect();
    draggingRef.current = id;
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    pointerDownRef.current = { x: event.clientX, y: event.clientY };
    lastPointerRef.current = { x: event.clientX, y: event.clientY, t: performance.now() };
  };

  return (
    <div className="min-h-screen text-zinc-100 antialiased">
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
        {/* Hero + Skills overview with draggable bubbles */}
        <section className="relative max-w-4xl min-h-[70vh] space-y-8 md:space-y-10 rounded-3xl border border-zinc-800/70 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-900/30 px-6 py-8 md:px-10 md:py-10 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Backend-orientierter Entwickler
            </p>
            <h1 className="text-balance bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-300 bg-clip-text text-4xl font-semibold leading-tight tracking-tight text-transparent md:text-6xl">
              Paul Kühn
            </h1>
          </div>

          <div className="space-y-4 text-sm text-zinc-400 md:text-base max-w-xl">
            <p>
              Backend-orientierter Informatikstudent im 2. Ausbildungsjahr an der IMS Hottingen.
            </p>
          </div>

          {/* Skills */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800/70 bg-gradient-to-b from-zinc-950/80 to-zinc-900/40 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/80 text-[#81F4E1]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <ellipse cx="12" cy="6" rx="6.5" ry="3" />
                  <path d="M5.5 6v5.5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6" />
                  <path d="M5.5 14v3.5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V14" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Backend
              </p>
              <p className="mt-1 text-sm text-zinc-200">Python, Flask, API-Logik</p>
            </div>

            <div className="rounded-2xl border border-zinc-800/70 bg-gradient-to-b from-zinc-950/80 to-zinc-900/40 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/80 text-[#81F4E1]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 9.5h18" />
                  <path d="M7 7h.01M10 7h.01M13 7h.01" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Web
              </p>
              <p className="mt-1 text-sm text-zinc-200">HTML, Bootstrap, JavaScript</p>
            </div>

            <div className="rounded-2xl border border-zinc-800/70 bg-gradient-to-b from-zinc-950/80 to-zinc-900/40 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/80 text-[#81F4E1]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Frontend
              </p>
              <p className="mt-1 text-sm text-zinc-200">React, TypeScript, Tailwind CSS</p>
            </div>
          </div>

          {/* Draggable navigation bubbles area – nav bubbles below intro & skills */}
          <div
            ref={containerRef}
            className="relative mt-10 h-64 md:h-72"
          >
            <div className="pointer-events-none absolute inset-0 -z-0">
              {bubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  type="button"
                  onPointerDown={(event) => handlePointerDown(event, bubble.id)}
                  className="floating-bubble"
                  aria-label={bubble.label}
                  style={{
                    width: BUBBLE_SIZE,
                    height: BUBBLE_SIZE,
                    left: bubble.x,
                    top: bubble.y,
                    pointerEvents: "auto",
                  }}
                >
                  <span className="bubble-inner">
                    <span className="bubble-icon">
                      <BubbleIcon type={bubble.icon} />
                    </span>
                    <span className="bubble-label">{bubble.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
