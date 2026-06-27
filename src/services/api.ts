const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface ApiError {
  error: string;
}

async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("elegia-token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erro ${response.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => fetchJson<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => fetchJson<T>(path, { method: "DELETE" }),
};

export function setToken(token: string) {
  localStorage.setItem("elegia-token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("elegia-token");
}

export function removeToken() {
  localStorage.removeItem("elegia-token");
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function isAdmin() {
  return getUser()?.role === "admin";
}
