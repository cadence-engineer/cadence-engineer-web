import { redirect } from "next/navigation";
import { DashboardContent } from "../components/dashboard-content";
import { SetupContent } from "../components/setup-content";
import { getValidAccessTokenFromCookies } from "@/lib/server/auth-session";
import { fetchDashboardSetupState } from "@/lib/server/setup";

export default async function DashboardPage() {
  const accessToken = await getValidAccessTokenFromCookies();

  if (!accessToken) {
    redirect("/");
  }

  const { isSetupComplete, selectedOrganizationLogin, isUnauthorized } =
    await fetchDashboardSetupState(accessToken);

  if (isUnauthorized) {
    redirect("/auth/sign-out");
  }

  if (!isSetupComplete) {
    return <SetupContent />;
  }

  return (
    <DashboardContent
      isSetupComplete={isSetupComplete}
      selectedOrganizationLogin={selectedOrganizationLogin}
    />
  );
}
