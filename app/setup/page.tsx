"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchSetupRequired,
  fetchOrganizations,
  isApiRequestError,
  isReauthRequiredError,
  isUnauthorizedError,
  startSetup,
} from "@/lib/api/organizations-client";

const GITHUB_APP_INSTALL_URL =
  "https://github.com/apps/cadence-engineer/installations/new";

export default function SetupPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrganizationLogin, setSelectedOrganizationLogin] = useState<string | null>(
    null,
  );
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganizations() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [availableOrganizations, isSetupRequired] = await Promise.all([
          fetchOrganizations(),
          fetchSetupRequired(),
        ]);
        const availableOrganizationLogins = availableOrganizations.map(
          (organization) => organization.login,
        );

        setOrganizations(availableOrganizationLogins);
        setSelectedOrganizationLogin(availableOrganizationLogins[0] ?? null);

        if (!isSetupRequired) {
          router.replace("/");
          return;
        }
      } catch (error) {
        if (isUnauthorizedError(error)) {
          router.replace("/sign-in");
          return;
        }

        if (isReauthRequiredError(error)) {
          router.replace(error.reauthUrl);
          return;
        }

        console.error("Failed loading organizations", error);
        setErrorMessage("Could not load organizations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrganizations();
  }, [router]);

  function handleSelectOrganization(login: string) {
    if (isSubmittingSetup || selectedOrganizationLogin === login) {
      return;
    }

    setSelectedOrganizationLogin(login);
    setErrorMessage(null);
  }

  async function handleDone() {
    if (!selectedOrganizationLogin || isSubmittingSetup) {
      return;
    }

    setIsSubmittingSetup(true);
    setErrorMessage(null);

    try {
      await startSetup(selectedOrganizationLogin);
      router.push("/");
      router.refresh();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      if (isReauthRequiredError(error)) {
        router.replace(error.reauthUrl);
        return;
      }

      if (isApiRequestError(error) && error.status === 409) {
        router.push("/");
        router.refresh();
        return;
      }

      console.error("Failed starting setup", error);
      setErrorMessage(
        isApiRequestError(error)
          ? error.message
          : "Could not start setup. Please try again.",
      );
    } finally {
      setIsSubmittingSetup(false);
    }
  }

  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
          Setup
        </h1>
        <p className="mb-6 text-black">
          Choose the GitHub organization that Cadence Engineer should initialize.
        </p>

        {isLoading ? <p className="text-sm text-black/80">Loading organizations...</p> : null}

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
              Add GitHub organization
            </a>
          </div>
        ) : null}

        {!isLoading && !errorMessage && organizations.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {organizations.map((organizationLogin) => {
                const isSelected = selectedOrganizationLogin === organizationLogin;

                return (
                  <button
                    key={organizationLogin}
                    type="button"
                    onClick={() => void handleSelectOrganization(organizationLogin)}
                    disabled={isSubmittingSetup}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#FF2D55] bg-[#FFF4F7]"
                        : "border-black/10 bg-white hover:border-[#FF2D55]/60"
                    }`}
                  >
                    <p className="text-base font-semibold text-black">
                      {organizationLogin}
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => void handleDone()}
              disabled={!selectedOrganizationLogin || isSubmittingSetup}
              className="flex w-full items-center justify-center rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingSetup ? "Starting setup..." : "Start setup"}
            </button>
            <a
              href={GITHUB_APP_INSTALL_URL}
              className="flex w-full items-center justify-center rounded-lg border border-[#FF2D55] bg-transparent px-5 py-3 text-sm font-semibold text-[#FF2D55] transition hover:bg-[#FFF4F7]"
            >
              Add GitHub organization
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}
