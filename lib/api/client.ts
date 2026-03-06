export async function fetchBff(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith("/") ? path : `/${path}`;
  return fetch(url, {
    ...init,
    credentials: "include",
    cache: "no-store",
  });
}
