import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardContent } from "../components/dashboard-content";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";
import { fetchDashboardSetupState } from "@/lib/server/setup";

type DashboardPageProps = {
  searchParams: Promise<{ auth?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.access)?.value ?? null;

  if (!accessToken) {
    redirect("/");
  }

  const { auth } = await searchParams;
  const { isSetupComplete, selectedOrganizationLogin, isUnauthorized } =
    await fetchDashboardSetupState(accessToken);

  if (isUnauthorized) {
    redirect("/auth/sign-out");
  }

  return (
    <DashboardContent
      showAuthSuccess={auth === "success"}
      isSetupComplete={isSetupComplete}
      selectedOrganizationLogin={selectedOrganizationLogin}
    />
  );
}
