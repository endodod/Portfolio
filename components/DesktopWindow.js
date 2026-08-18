"use client";
import { Rnd } from "react-rnd";

// Wraps a window's markup in a draggable/resizable box on desktop.
// When inactive (mobile), it renders children untouched so the existing
// static/stacked mobile layout is unaffected.
export default function DesktopWindow({
  active = true,
  defaultPos,
  minWidth = 220,
  minHeight = 70,
  zIndex,
  onFocus,
  children,
}) {
  if (!active) return children;

  return (
    <Rnd
      default={defaultPos}
      minWidth={minWidth}
      minHeight={minHeight}
      dragHandleClassName="window-drag-handle"
      style={{ zIndex }}
      onDragStart={onFocus}
      onResizeStart={onFocus}
      onMouseDown={onFocus}
    >
      {children}
    </Rnd>
  );
}
