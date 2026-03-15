import { fetchBff } from "@/lib/api/client";

export type Organization = {
  login: string;
};

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

type OrganizationsResponse = {
  organizations: Organization[];
};

export async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetchBff("/api/organizations", { method: "GET" });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(`Organizations request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as OrganizationsResponse;
  return Array.isArray(payload.organizations) ? payload.organizations : [];
}

type SelectedOrganizationResponse = {
  login: string | null;
};

export async function fetchSelectedOrganizationLogin(): Promise<string | null> {
  const response = await fetchBff("/api/organization", { method: "GET" });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(
      `Selected organization request failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as SelectedOrganizationResponse;
  return typeof payload.login === "string" ? payload.login : null;
}

export async function updateSelectedOrganization(login: string): Promise<string> {
  const response = await fetchBff("/api/organization", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login }),
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(
      `Organization update request failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as SelectedOrganizationResponse;
  if (typeof payload.login !== "string") {
    throw new Error("Organization update returned invalid payload");
  }

  return payload.login;
}
