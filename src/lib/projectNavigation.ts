import type { Project } from "../types/project";

const SESSION_STORAGE_KEY = "dashboard_user";

interface StoredSession {
  token?: string;
  user?: {
    id?: string;
    role?: string;
  };
}

export function irAlProyecto(project: Project): void {
  const session = readStoredSession();
  const token = session?.token || localStorage.getItem("token");
  const rol = session?.user?.role || localStorage.getItem("rol");
  const userId = session?.user?.id || localStorage.getItem("userId");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  const destino = new URL(project.url, window.location.origin);
  destino.searchParams.set("token", token);

  if (rol) destino.searchParams.set("rol", rol);
  if (userId) destino.searchParams.set("userId", userId);

  window.location.href = destino.toString();
}

function readStoredSession(): StoredSession | null {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSession) return null;

    const session = JSON.parse(storedSession) as unknown;
    if (!session || typeof session !== "object") return null;
    return session as StoredSession;
  } catch {
    return null;
  }
}
