import { APP_ENV } from "@/lib/env";

export default function EnvBadge() {
  const isDemo = APP_ENV === "demo";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider ${
        isDemo
          ? "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]"
          : "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isDemo ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--success))]"
        }`}
      />
      {isDemo ? "Demo Mode" : "Production"}
    </span>
  );
}
