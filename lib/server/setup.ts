import { fetchCadenceApi } from "@/lib/server/cadence-api";

export type DashboardSetupState = {
  isSetupComplete: boolean;
  selectedOrganizationLogin: string | null;
  isUnauthorized: boolean;
};

export async function shouldShowSetupButton(accessToken: string): Promise<boolean> {
  const state = await fetchDashboardSetupState(accessToken);
  return !state.isSetupComplete;
}

export async function fetchDashboardSetupState(
  accessToken: string
): Promise<DashboardSetupState> {
  try {
    const [setupResponse, organizationResponse] = await Promise.all([
      fetchCadenceApi("/v1/setup", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        redirect: "manual",
        cache: "no-store",
      }),
      fetchCadenceApi("/v1/organization", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        redirect: "manual",
        cache: "no-store",
      }),
    ]);

    if (
      setupResponse.status === 401 ||
      setupResponse.status === 403 ||
      organizationResponse.status === 401 ||
      organizationResponse.status === 403
    ) {
      return {
        isSetupComplete: false,
        selectedOrganizationLogin: null,
        isUnauthorized: true,
      };
    }

    const selectedOrganizationLogin =
      organizationResponse.ok ? await readOrganizationLogin(organizationResponse) : null;

    return {
      isSetupComplete: setupResponse.ok,
      selectedOrganizationLogin,
      isUnauthorized: false,
    };
  } catch (error) {
    console.error("Failed loading dashboard setup state", error);
    return {
      isSetupComplete: false,
      selectedOrganizationLogin: null,
      isUnauthorized: false,
    };
  }
}

async function readOrganizationLogin(response: Response): Promise<string | null> {
  try {
    const payload = (await response.json()) as unknown;

    if (typeof payload !== "object" || payload === null) {
      return null;
    }

    const maybePayload = payload as Record<string, unknown>;
    return typeof maybePayload.login === "string" ? maybePayload.login : null;
  } catch (error) {
    console.error("Failed reading selected organization", error);
    return null;
  }
}
