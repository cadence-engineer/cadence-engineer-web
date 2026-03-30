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

export class ReauthRequiredError extends Error {
  readonly reauthUrl: string;

  constructor(reauthUrl: string) {
    super("Reauthentication required");
    this.name = "ReauthRequiredError";
    this.reauthUrl = reauthUrl;
  }
}

export function isReauthRequiredError(error: unknown): error is ReauthRequiredError {
  return error instanceof ReauthRequiredError;
}

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

type RedirectErrorResponse = {
  code?: string;
  reauthUrl?: string;
};

async function throwIfReauthRequired(response: Response): Promise<void> {
  if (response.status !== 409) {
    return;
  }

  let payload: RedirectErrorResponse | null = null;

  try {
    payload = (await response.clone().json()) as RedirectErrorResponse;
  } catch {
    return;
  }

  if (
    payload?.code === "reauth_required" &&
    typeof payload.reauthUrl === "string" &&
    payload.reauthUrl.length > 0
  ) {
    throw new ReauthRequiredError(payload.reauthUrl);
  }
}

type OrganizationsResponse = {
  organizations: Organization[];
};

type ErrorResponse = {
  reason?: string;
};

async function readErrorReason(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorResponse;
    if (typeof payload.reason === "string" && payload.reason.length > 0) {
      return payload.reason;
    }
  } catch {
    // Ignore parse errors and fall back to a generic message.
  }

  return `Request failed with status ${response.status}`;
}
export async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetchBff("/api/organizations", { method: "GET" });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  await throwIfReauthRequired(response);

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

  await throwIfReauthRequired(response);

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

  await throwIfReauthRequired(response);

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

export async function fetchSetupRequired(): Promise<boolean> {
  const response = await fetchBff("/api/setup", { method: "GET" });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  await throwIfReauthRequired(response);

  if (response.status === 404) {
    return true;
  }

  if (response.status === 204) {
    return false;
  }

  if (!response.ok) {
    throw new ApiRequestError(await readErrorReason(response), response.status);
  }

  throw new ApiRequestError("Setup request returned an unexpected response", response.status);
}

export async function startSetup(login: string): Promise<void> {
  const response = await fetchBff("/api/setup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login }),
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  await throwIfReauthRequired(response);

  if (response.status === 202) {
    return;
  }

  if (!response.ok) {
    throw new ApiRequestError(await readErrorReason(response), response.status);
  }

  throw new ApiRequestError("Setup start returned an unexpected response", response.status);
}
