import { useState, type FormEvent } from "react";
import type { Project } from "../types/project";

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (project: Project) => void;
}

export default function NewProjectModal({ onClose, onCreate }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !url.trim()) {
      setError("Nombre, descripción y URL son obligatorios.");
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      code: `PROJ-${String(Date.now()).slice(-4)}`,
      name: name.trim(),
      description: description.trim(),
      url: url.trim(),
      previewImage: previewImage.trim() || undefined,
      status: "activo",
      createdAt: new Date().toISOString(),
    };

    onCreate(newProject);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Nuevo proyecto</h2>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__field">
            <span>Nombre</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Analizador de sentimientos"
            />
          </label>

          <label className="modal__field">
            <span>Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del proyecto"
              rows={3}
            />
          </label>

          <label className="modal__field">
            <span>URL del proyecto</span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tu-proyecto.vercel.app"
            />
          </label>

          <label className="modal__field">
            <span>URL de imagen de vista previa (opcional)</span>
            <input
              type="url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="https://..."
            />
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="modal__cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal__submit-btn">
              Crear proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}