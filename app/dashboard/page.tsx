import { redirect } from "next/navigation";
import { DashboardContent } from "../components/dashboard-content";
import { getValidAccessTokenFromCookies } from "@/lib/server/auth-session";
import { fetchDashboardSetupState } from "@/lib/server/setup";

type DashboardPageProps = {
  searchParams: Promise<{ auth?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const accessToken = await getValidAccessTokenFromCookies();

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
