import type { Project } from "../types/project";

export const initialProjects: Project[] = [
  {
    id: "1",
    code: "PROJ-01",
    name: "Mercamax - Análisis",
    description: "Sistema de Análisis basado en un supermercado en donde puedes realizar diferentes acciones, desde importar un csv, hasta exportar y ver reportes.",
    url: "https://big-data-gold.vercel.app/",
    previewImage: "https://res.cloudinary.com/txyd6k4m/image/upload/v1788537194/mercamax.png",
    status: "activo",
    createdAt: "2026-08-21",
  },
  {
    id: "2",
    code: "PROJ-02",
    name: "Proyecto curso TECNOLOGÍA CLOUD CON AWS",
    description: "Información desconocida del curso y/o proyecto.",
    url: "https://github.com/GR-Codes18/Dashboard_General",
    previewImage: "",
    status: "pendiente",
    createdAt: "2026-02-18",
  },
  {
    id: "3",
    code: "PROJ-03",
    name: "Proyecto curso AI-900T00 CONCEPTOS BÁSICOS DE IA EN MICROSOFT AZURE",
    description: "Información desconocida del curso y/o proyecto.",
    url: "https://azure.microsoft.com/es-es/resources/cloud-computing-dictionary/what-is-artificial-intelligence",
    previewImage: "",
    status: "pendiente",
    createdAt: "2025-11-02",
  },
];