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
    <main className="h-full bg-slate-100 px-6 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Cadence Engineer
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">
              API Status
            </h2>
            <p className="text-sm text-slate-600">
              Connect this area to the Vapor backend health endpoint.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-600">
              Show latest jobs, agent runs, and engineering updates here.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">
              Team Insights
            </h2>
            <p className="text-sm text-slate-600">
              Surface key metrics from Cadence services and user actions.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
