import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Cadence Engineer",
  description: "Legal notice and provider information for Cadence Engineer",
};

export default function ImpressumPage() {
  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black">Impressum</h1>
        <p className="mb-4 text-black">
          Anbieter: Dominik Strasser
          <br />
          Kontakt: dominik.strasser@cadence.engineer
        </p>
        <p className="text-black">
          This website is currently in development and is not intended for public use.
        </p>
      </section>
    </main>
  );
}
