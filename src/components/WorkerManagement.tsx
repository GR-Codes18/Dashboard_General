import { useState, type FormEvent } from "react";
import { AuthApiError, createWorker, isApiConfigured } from "../lib/authApi";
import type { AuthSession } from "../types/auth";

interface WorkerManagementProps {
  session: AuthSession;
}

export default function WorkerManagement({ session }: WorkerManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session.user.role !== "ANALISTA") return null;

  function close() {
    setIsOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setCreatedPassword("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!isApiConfigured) throw new Error("Configura VITE_API_URL para crear Trabajadores desde el backend.");
      const response = await createWorker(session.token, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setCreatedPassword(response.trabajador.passwordInicial);
    } catch (requestError) {
      if (requestError instanceof AuthApiError && requestError.status === 401) {
        setError("Tu sesión no es válida. Inicia sesión de nuevo.");
      } else if (requestError instanceof AuthApiError && requestError.status === 403) {
        setError("Solo un Analista puede crear Trabajadores.");
      } else if (requestError instanceof AuthApiError && requestError.status === 409) {
        setError("Ya existe un usuario con ese correo.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "No se pudo crear el Trabajador.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className="actions-bar__secondary-btn" onClick={() => setIsOpen(true)}>
        + Crear Trabajador
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal__header">
              <div>
                <p className="modal__eyebrow">Acceso del equipo</p>
                <h2 className="modal__title">Crear Trabajador</h2>
              </div>
              <button type="button" className="modal__close" onClick={close} aria-label="Cerrar">×</button>
            </div>

            {createdPassword ? (
              <div className="modal__success">
                <p>Trabajador creado correctamente.</p>
                <p>Comparte esta contraseña inicial fuera del sistema:</p>
                <strong>{createdPassword}</strong>
                <button type="button" className="modal__submit-btn" onClick={close}>Listo</button>
              </div>
            ) : (
              <form className="modal__form" onSubmit={handleSubmit}>
                <label className="modal__field"><span>Nombre</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
                <label className="modal__field"><span>Correo electrónico</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
                <label className="modal__field"><span>Contraseña inicial</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></label>
                {error && <p className="modal__error" role="alert">{error}</p>}
                <div className="modal__actions">
                  <button type="button" className="modal__cancel-btn" onClick={close}>Cancelar</button>
                  <button type="submit" className="modal__submit-btn" disabled={isSubmitting}>{isSubmitting ? "Creando..." : "Crear Trabajador"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
