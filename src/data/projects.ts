import type { Project } from "../types/project";

export const initialProjects: Project[] = [
  {
    id: "1",
    code: "PROJ-01",
    name: "Mercamax - Análisis",
    description: "Sistema de Análisis basado en un supermercado en donde puedes realizar diferentes acciones, desde importar un csv, hasta exportar y ver reportes.",
    url: "https://big-data-gold.vercel.app/",
    previewImage: "",
    status: "activo",
    createdAt: "2026-03-10",
  },
  {
    id: "2",
    code: "PROJ-02",
    name: "Tienda en línea",
    description: "E-commerce con carrito de compras y pasarela de pago simulada.",
    url: "https://ejemplo-proyecto-2.vercel.app",
    previewImage: "",
    status: "activo",
    createdAt: "2026-02-18",
  },
  {
    id: "3",
    code: "PROJ-03",
    name: "Gestor de tareas",
    description: "Aplicación tipo Kanban para organizar tareas por curso.",
    url: "https://ejemplo-proyecto-3.vercel.app",
    previewImage: "",
    status: "archivado",
    createdAt: "2025-11-02",
  },
];