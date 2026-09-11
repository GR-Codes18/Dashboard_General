import type { Project } from "../types/project";
import { irAlProyecto } from "../lib/projectNavigation";

interface ProjectCardProps {
  project: Project;
}

// Mapeo para formatear el texto del estado de forma limpia
const statusLabels: Record<Project["status"], string> = {
  activo: "Activo - En progreso",
  pendiente: "Pendiente",
  finalizado: "Finalizado",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { code, name, description, url, previewImage, status, createdAt } = project;

  const formattedDate = new Date(createdAt).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="project-card">
      <div className="project-card__preview">
        {previewImage ? (
          <img src={previewImage} alt={`Vista previa de ${name}`} />
        ) : (
          <div className="project-card__preview-placeholder">
            <span>{code}</span>
          </div>
        )}
        <span className={`project-card__status project-card__status--${status}`}>
          {statusLabels[status] ?? status}
        </span>
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__code">{code}</span>
          <span className="project-card__date">{formattedDate}</span>
        </div>

        <h3 className="project-card__name">{name}</h3>
        <p className="project-card__description">{description}</p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__link"
          onClick={(event) => {
            event.preventDefault();
            irAlProyecto(project);
          }}
        >
          Abrir proyecto
        </a>
      </div>
    </article>
  );
}