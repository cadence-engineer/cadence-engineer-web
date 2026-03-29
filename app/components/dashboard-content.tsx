"use client";

type DashboardContentProps = {
  showAuthSuccess: boolean;
  isSetupComplete: boolean;
  selectedOrganizationLogin: string | null;
};

export function DashboardContent({
  showAuthSuccess,
  isSetupComplete,
  selectedOrganizationLogin,
}: DashboardContentProps) {
  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        {showAuthSuccess ? (
          <p className="mb-4 rounded-md bg-[#E8FFEF] px-3 py-2 text-sm text-[#146B2E]">
            Successfully authenticated with GitHub.
          </p>
        ) : null}
        <div className="mb-8 flex flex-col justify-between gap-4 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Dashboard
            </h1>
          </div>
        </div>
        <div className="mb-8 flex flex-wrap gap-3">
          <article className="min-w-[280px] flex-1 rounded-2xl border border-black/10 bg-[#FFF7F9] p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D55]">
                Organization
              </h2>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  isSetupComplete
                    ? "bg-[#E8FFEF] text-[#146B2E]"
                    : "bg-[#FFE8EE] text-[#8A1230]"
                }`}
              >
                {isSetupComplete ? "Setup complete" : "Setup required"}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-black">
              {selectedOrganizationLogin ?? "No organization selected"}
            </p>
            <p className="mt-2 text-sm leading-6 text-black/70">
              {selectedOrganizationLogin
                ? isSetupComplete
                  ? "Cadence Engineer is connected to this organization."
                  : "Finish setup to initialize Cadence Engineer for this organization."
                : "Choose a GitHub organization to initialize Cadence Engineer."}
            </p>
          </article>
        </div>

      </section>
    </main>
  );
}
