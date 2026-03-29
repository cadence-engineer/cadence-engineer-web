"use client";

import { InfoCard, PageHeader, PageShell, PageSurface } from "./page-shell";

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
    <PageShell>
      <PageSurface className="space-y-6">
        {showAuthSuccess ? (
          <p className="rounded-md bg-[#E8FFEF] px-3 py-2 text-sm text-[#146B2E]">
            Successfully authenticated with GitHub.
          </p>
        ) : null}
        <PageHeader title="Dashboard" />
        <InfoCard tone="tinted">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D55]">
                Organization
              </h2>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  isSetupComplete
                    ? "bg-[#E8FFEF] text-[#146B2E]"
                    : "bg-[#FFE8EE] text-[#8A1230]"
                }`}
              >
                {isSetupComplete ? "Setup complete" : "Setup required"}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold tracking-tight text-black">
                {selectedOrganizationLogin ?? "No organization selected"}
              </p>
              <p className="text-sm leading-6 text-black/70">
                {selectedOrganizationLogin
                  ? isSetupComplete
                    ? "Cadence Engineer is connected to this organization."
                    : "Finish setup to initialize Cadence Engineer for this organization."
                  : "Choose a GitHub organization to initialize Cadence Engineer."}
              </p>
            </div>
          </div>
        </InfoCard>
      </PageSurface>
    </PageShell>
  );
}
