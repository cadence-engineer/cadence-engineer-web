import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signIn() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set("cadence_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export default function SignInPage() {
  return (
    <main className="flex h-full items-center justify-center bg-slate-100 px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          Sign in
        </h1>
        <p className="mb-6 text-slate-600">
          Continue to your Cadence Engineer dashboard.
        </p>
        <form action={signIn}>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
