"use client";

import { useEffect, useState } from "react";
import {
  fetchOrganizations,
  type Organization,
} from "@/lib/api/organizations-client";

const GITHUB_APP_INSTALL_URL =
  "https://github.com/apps/cadence-engineer/installations/new";

export default function SetupPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganizations() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextOrganizations = await fetchOrganizations();
        setOrganizations(nextOrganizations);
        setSelectedOrganizationId(nextOrganizations[0]?.id ?? null);
      } catch (error) {
        console.error("Failed loading organizations", error);
        setErrorMessage("Could not load organizations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrganizations();
  }, []);

  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
          Setup
        </h1>
        <p className="mb-6 text-black">
          Connect your GitHub organization and choose where Cadence Engineer should run.
        </p>

        {isLoading ? (
          <p className="text-sm text-black/80">
            Loading organizations...
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-md bg-[#FFE8EE] px-3 py-2 text-sm text-[#8A1230]">
            {errorMessage}
          </p>
        ) : null}

        {!isLoading && !errorMessage && organizations.length === 0 ? (
          <div className="rounded-xl bg-[#FFF4F7] p-6">
            <p className="mb-4 text-sm text-black">
              No linked organizations found yet.
            </p>
            <a
              href={GITHUB_APP_INSTALL_URL}
              className="inline-flex items-center justify-center rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045]"
            >
              Connect GitHub organization
            </a>
          </div>
        ) : null}

        {!isLoading && !errorMessage && organizations.length > 0 ? (
          <div className="space-y-3">
            {organizations.map((organization) => {
              const isSelected = selectedOrganizationId === organization.id;

              return (
                <button
                  key={organization.id}
                  type="button"
                  onClick={() => setSelectedOrganizationId(organization.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[#FF2D55] bg-[#FFF4F7]"
                      : "border-black/10 bg-white hover:border-[#FF2D55]/60"
                  }`}
                >
                  <p className="text-base font-semibold text-black">
                    {organization.name}
                  </p>
                  <p className="mt-1 text-sm text-black/70">
                    {organization.url}
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}
      </section>
    </main>
  );
}
