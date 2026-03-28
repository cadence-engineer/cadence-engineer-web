import { fetchCadenceApi } from "@/lib/server/cadence-api";

export async function shouldShowSetupButton(accessToken: string): Promise<boolean> {
  try {
    const response = await fetchCadenceApi("/v1/setup", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      redirect: "manual",
      cache: "no-store",
    });

    return response.status === 404;
  } catch (error) {
    console.error("Failed determining setup visibility", error);
    return false;
  }
}
