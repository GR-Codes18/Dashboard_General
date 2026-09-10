import { useEffect, useRef, useState, type FormEvent } from "react";

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

interface AuthScreenProps {
  onAuthenticated: (user: StoredUser) => void;
}

const USERS_STORAGE_KEY = "dashboard_users";

function getStoredUsers(): StoredUser[] {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? (JSON.parse(users) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const shortcutPresses = useRef(0);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (!event.ctrlKey || event.key.toLowerCase() !== "j") {
        shortcutPresses.current = 0;
        return;
      }

      event.preventDefault();
      shortcutPresses.current += 1;

      if (shortcutPresses.current === 2) {
        setIsRegistrationVisible(true);
        shortcutPresses.current = 0;
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    if (mode === "register") {
      if (!name.trim()) {
        setError("Escribe tu nombre para crear la cuenta.");
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (users.some((user) => user.email === normalizedEmail)) {
        setError("Ya existe una cuenta con este correo.");
        return;
      }

      const newUser = { name: name.trim(), email: normalizedEmail, password };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
      onAuthenticated(newUser);
      return;
    }

    const user = users.find(
      (storedUser) => storedUser.email === normalizedEmail && storedUser.password === password
    );

    if (!user) {
      setError("El correo o la contraseña no son correctos.");
      return;
    }

    onAuthenticated(user);
  }

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel__intro">
          <p className="auth-panel__eyebrow">Dashboard General</p>
          <h1 id="auth-title">Tu espacio de proyectos.</h1>
          <p>Organiza tus proyectos y cursos desde un solo lugar.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card__tabs" role="tablist" aria-label="Acceso a la cuenta">
            <button
              type="button"
              className={mode === "login" ? "auth-card__tab auth-card__tab--active" : "auth-card__tab"}
              onClick={() => changeMode("login")}
              role="tab"
              aria-selected={mode === "login"}
            >
              Iniciar sesión
            </button>
            {isRegistrationVisible && (
              <button
                type="button"
                className={mode === "register" ? "auth-card__tab auth-card__tab--active" : "auth-card__tab"}
                onClick={() => changeMode("register")}
                role="tab"
                aria-selected={mode === "register"}
              >
                Crear cuenta
              </button>
            )}
          </div>

          <form className="auth-card__form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label className="auth-card__field">
                <span>Nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="auth-card__field">
              <span>Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@correo.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-card__field">
              <span>Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                required
              />
            </label>

            {error && <p className="auth-card__error" role="alert">{error}</p>}

            <button type="submit" className="auth-card__submit">
              {mode === "login" ? "Entrar al dashboard" : "Crear mi cuenta"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}