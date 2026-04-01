import type { ReactNode } from "react";

type ClassNameValue = string | false | null | undefined;

function cn(...values: ClassNameValue[]) {
  return values.filter(Boolean).join(" ");
}

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn("h-full bg-transparent px-6 py-8 md:px-8 md:py-10", className)}>
      {children}
    </main>
  );
}

type PageSurfaceProps = {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow";
};

export function PageSurface({
  children,
  className,
  width = "default",
}: PageSurfaceProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10",
        width === "default" ? "max-w-4xl" : "max-w-md",
        className,
      )}
    >
      {children}
    </section>
  );
}

type PageHeaderProps = {
  title: string;
  titleAccessory?: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
  divider?: boolean;
};

export function PageHeader({
  title,
  titleAccessory,
  description,
  actions,
  className,
  divider = true,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-1.5",
        divider && "border-b border-black/8 pb-5",
        className,
      )}
    >
      <div className="flex flex-end flex-col gap-3 sm:flex-row">
        <h1 className="min-w-0 flex-1 text-3xl font-bold tracking-tight text-black">{title}</h1>
        {titleAccessory ? titleAccessory : null}
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {description ? <p className="text-sm align-baseline leading-6 text-black/70">{description}</p> : null}
    </div>
  );
}

type InfoCardProps = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "tinted";
};

export function InfoCard({
  children,
  className,
  tone = "default",
}: InfoCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border p-5",
        tone === "default" && "border-black/10 bg-white",
        tone === "muted" && "border-black/8 bg-[#F6F3F4]",
        tone === "tinted" && "border-black/10 bg-[#FFF7F9]",
        className,
      )}
    >
      {children}
    </article>
  );
}
