import { RotatingAudience } from "./components/rotating-audience";
import { DailiesContent } from "./components/dailies-content";
import { getValidAccessTokenFromCookies } from "@/lib/server/auth-session";

export default async function Home() {
  const accessToken = await getValidAccessTokenFromCookies();

  if (accessToken) {
    return <DailiesContent />;
  }

  return (
    <main className="flex h-full items-center justify-center bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="relative w-full max-w-4xl overflow-hidden rounded-2xl p-8 text-center shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <div className="absolute inset-0 bg-white" />
        <div className="relative z-10">
          <h1 className="mb-8 text-5xl font-black tracking-tight text-black md:text-6xl">
            A human-friendly frontend for Git.
          </h1>
          <p className="mx-auto max-w-3xl text-left text-xl font-semibold leading-9 text-black md:text-2xl md:leading-[1.45]">
            Translate software delivery activity into shared, human-readable
            understanding{" "}
            <RotatingAudience className="text-xl font-bold tracking-tight md:text-2xl" />
          </p>
        </div>
      </section>
    </main>
  );
}
