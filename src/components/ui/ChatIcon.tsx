/** Generic chat-bubble-with-phone glyph used for WhatsApp actions. */
export function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none">
      <path
        d="M12 2.75a9.25 9.25 0 0 0-8 13.9L2.75 21.25l4.75-1.22A9.25 9.25 0 1 0 12 2.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 7.6c.2-.4.5-.45.8-.45h.55c.2 0 .4.1.5.35l.75 1.8c.1.25.05.5-.12.7l-.6.7c.55 1.05 1.4 1.9 2.45 2.45l.7-.6c.2-.17.45-.22.7-.12l1.8.75c.25.1.35.3.35.5v.55c0 .3-.05.6-.45.8-.6.32-1.3.45-2 .3-2.9-.62-5.15-2.87-5.77-5.77-.15-.7-.02-1.4.3-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
