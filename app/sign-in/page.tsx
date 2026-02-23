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
    <main className="flex h-full items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
          Sign in
        </h1>
        <p className="mb-6 text-black">
          Continue to your Cadence Engineer dashboard.
        </p>
        <form action={signIn}>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045]"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
