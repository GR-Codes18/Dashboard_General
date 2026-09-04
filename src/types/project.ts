export interface Project {
  id: string;
  code: string; // ej. "PROJ-01"
  name: string;
  description: string;
  url: string;
  previewImage?: string;
  status: "activo" | "archivado";
  createdAt: string; // ISO date string
}