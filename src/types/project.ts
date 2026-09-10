export interface Project {
  id: string;
  code: string; // ej. "PROJ-01"
  name: string;
  description: string;
  url: string;
  previewImage?: string;
  status: "activo" | "pendiente" | "finalizado";
  createdAt: string; // ISO date string
}