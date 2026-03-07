import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Cadence Engineer",
  description: "Contact information for Cadence Engineer",
};

export default function ContactPage() {
  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black">Contact</h1>
        <address className="mb-4 not-italic text-black">
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
      </section>
    </main>
  );
}
