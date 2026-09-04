interface NewProjectButtonProps {
  projectCount: number;
  onClick: () => void;
}

export default function NewProjectButton({ projectCount, onClick }: NewProjectButtonProps) {
  const countLabel =
    projectCount === 1 ? "1 proyecto" : `${projectCount} proyectos`;

  return (
    <div className="actions-bar">
      <button className="actions-bar__new-btn" onClick={onClick}>
        + Nuevo proyecto
      </button>
      <span className="actions-bar__count">{countLabel}</span>
    </div>
  );
}