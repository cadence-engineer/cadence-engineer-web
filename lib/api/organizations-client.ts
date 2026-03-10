import { fetchBff } from "@/lib/api/client";

export type Organization = {
  id: number;
  name: string;
  url: string;
};

type OrganizationsResponse = {
  organizations: Organization[];
};

export async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetchBff("/api/organizations", { method: "GET" });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`Organizations request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as OrganizationsResponse;
  return Array.isArray(payload.organizations) ? payload.organizations : [];
}
