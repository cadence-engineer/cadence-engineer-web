import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signOut() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("cadence_session");

  redirect("/");
}

export default function DashboardPage() {
  return (
    <main className="h-full bg-white px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <div className="mb-8 flex flex-col justify-between gap-4 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Dashboard
            </h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg bg-[#FFD6E0] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#FFB3C4]"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-xl bg-[#FF2D55] p-6 text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
            <h2 className="mb-1 text-sm font-semibold">
              API Status
            </h2>
            <p className="text-sm">
              Connect this area to the Vapor backend health endpoint.
            </p>
          </article>
          <article className="rounded-xl bg-[#E60045] p-6 text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
            <h2 className="mb-1 text-sm font-semibold">
              Recent Activity
            </h2>
            <p className="text-sm">
              Show latest jobs, agent runs, and engineering updates here.
            </p>
          </article>
          <article className="rounded-xl bg-[#FFD6E0] p-6 text-black shadow-[0_10px_24px_rgba(0,0,0,0.15)]">
            <h2 className="mb-1 text-sm font-semibold">
              Team Insights
            </h2>
            <p className="text-sm">
              Surface key metrics from Cadence services and user actions.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
