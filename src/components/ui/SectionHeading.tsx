import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-electric-soft ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-gradient-to-r from-electric to-violet" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {intro ? <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{intro}</p> : null}
    </Reveal>
  );
}
