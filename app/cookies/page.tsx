import type { Metadata } from "next";
import { PageHeader, PageShell, PageSurface } from "@/app/components/page-shell";

export const metadata: Metadata = {
  title: "Cookies | Cadence Engineer",
  description: "Information about cookie usage in Cadence Engineer",
};

export default function CookiesPage() {
  return (
    <PageShell>
      <PageSurface className="space-y-6">
        <PageHeader title="Cookies" />
        <p className="text-black/80">
          We only use cookies that are needed to run this service. They keep you signed in and help keep your
          account secure while you use the app.
        </p>
        <p className="text-black/80">
          We do not use cookies for ads, analytics, or tracking you across other websites.
        </p>
        <p className="text-black/80">
          We also do not collect personal profile information through cookies.
        </p>
      </PageSurface>
    </PageShell>
  );
}
