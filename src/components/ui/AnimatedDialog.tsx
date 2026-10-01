"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Modal built on the native <dialog> element, which provides focus trapping,
 * an inert background, Escape handling and focus return to the trigger.
 * Children animate in/out with Motion; the dialog closes after the exit animation.
 */
export function AnimatedDialog({
  open,
  onClose,
  labelledBy,
  id,
  children,
  onClosed,
}: {
  open: boolean;
  onClose: () => void;
  /** Runs after the exit animation finishes and the dialog has closed. */
  onClosed?: () => void;
  labelledBy: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("scroll-locked");
    }
  }, [open]);

  useEffect(() => {
    return () => document.documentElement.classList.remove("scroll-locked");
  }, []);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      aria-modal="true"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 h-dvh w-screen overflow-hidden"
    >
      <AnimatePresence
        onExitComplete={() => {
          ref.current?.close();
          document.documentElement.classList.remove("scroll-locked");
          onClosed?.();
        }}
      >
        {open ? children : null}
      </AnimatePresence>
    </dialog>
  );
}
