import type { ConfigValue } from "@/config/site";

/** Renders a config value, tagging unverified values so placeholders are never mistaken for real details. */
export function ConfigText({ item }: { item: ConfigValue }) {
  return (
    <>
      {item.value}
      {!item.verified ? <PlaceholderTag /> : null}
    </>
  );
}

export function PlaceholderTag() {
  return (
    <span
      className="ml-2 inline-block rounded-full border border-dashed border-amber-300/50 px-2 py-0.5 align-middle text-[0.65rem] font-medium uppercase tracking-wider text-amber-200"
      title="Placeholder — replace in src/config/site.ts"
    >
      Placeholder
    </span>
  );
}
