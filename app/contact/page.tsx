import type { Metadata } from "next";
import { PageHeader, PageShell, PageSurface } from "@/app/components/page-shell";

export const metadata: Metadata = {
  title: "Contact | Cadence Engineer",
  description: "Contact information for Cadence Engineer",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageSurface className="space-y-6">
        <PageHeader title="Contact" />
        <address className="not-italic leading-7 text-black/80">
          Dominik Strasser
          <br />
          dominik.strasser@cadence.engineer
          <br />
          Unter-Meidlinger Strasse 16-22/12/17
          <br />
          Vienna 1120
          <br />
          Austria
        </address>
      </PageSurface>
    </PageShell>
  );
}
