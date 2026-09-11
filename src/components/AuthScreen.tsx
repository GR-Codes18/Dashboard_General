import { useEffect, useState, type FormEvent } from "react";
import { AuthApiError, getLoginRequestStatus, isApiConfigured, login, resendOtp, verifyOtp } from "../lib/authApi";
import type { AuthSession } from "../types/auth";

interface AuthScreenProps {
  onAuthenticated: (session: AuthSession) => void;
}

type AuthStep = "credentials" | "otp" | "waiting" | "denied";

const DEMO_USERS = [
  { name: "Usuario Demo", email: "demo@dashboard.local", password: "Dashboard123!" },
  { name: "Analista Big Data", email: "analistabigdata2@gmail.com", password: "12345678" },
];

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<AuthStep>("credentials");
  const [userId, setUserId] = useState("");
  const [loginRequestId, setLoginRequestId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step !== "waiting" || !loginRequestId) return;

    let cancelled = false;
    const pollStatus = async () => {
      try {
        const response = await getLoginRequestStatus(loginRequestId, email.trim().toLowerCase());
        if (cancelled) return;

        const nextUserId = response.userId || response.id || response.trabajadorId || response.data?.userId || response.data?.id;
        if (nextUserId) setUserId(nextUserId);
        if (response.estado === "PENDIENTE") {
          setMessage("El Analista todavía no ha respondido.");
          return;
        }
        if (response.estado === "ACEPTADA") {
          setStep("otp");
          setMessage("Solicitud aprobada. Revisa tu correo e introduce el código OTP.");
          return;
        }
        setStep("denied");
        setMessage(response.estado === "RECHAZADA" ? "El acceso fue rechazado." : "La solicitud expiró. Intenta el login de nuevo.");
      } catch (requestError) {
        if (!cancelled) setError(getErrorMessage(requestError));
      }
    };

    void pollStatus();
    const intervalId = window.setInterval(() => void pollStatus(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [email, loginRequestId, step]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!isApiConfigured) {
        const demoUser = DEMO_USERS.find((user) => user.email === email.trim().toLowerCase() && user.password === password);
        if (!demoUser) throw new Error("El correo o la contraseña no son correctos.");
        if (step === "credentials") {
          setUserId("demo-user");
          setStep("otp");
          setMessage("Modo demo: usa el código 123456 para continuar.");
        } else {
          if (otp.trim() !== "123456") throw new Error("El código OTP demo no es correcto.");
          onAuthenticated({ token: "demo-token", user: { id: "demo-user", name: demoUser.name, email: demoUser.email, role: "ANALISTA" } });
        }
        return;
      }

      if (step === "credentials") {
        const response = await login(email.trim().toLowerCase(), password);
        const nextUserId = response.userId || response.id || response.trabajadorId || response.data?.userId || response.data?.id || response.user?.id;
        if (nextUserId) setUserId(nextUserId);
        if (response.loginRequestId) {
          setLoginRequestId(response.loginRequestId);
          setStep("waiting");
          setMessage(response.message || "Solicitud enviada. Espera la aprobación del Analista.");
        } else if (nextUserId) {
          setStep("otp");
          setMessage("Revisa tu correo e introduce el código OTP.");
        } else {
          throw new Error("La respuesta de login no incluye el userId necesario para verificar el OTP.");
        }
      } else {
        if (!userId) throw new Error("No se recibió el userId para verificar el OTP.");
        onAuthenticated(await verifyOtp(userId, otp.trim()));
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    try {
      await resendOtp(userId);
      setMessage("Hemos enviado un nuevo código OTP a tu correo.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  function restart() {
    setStep("credentials");
    setUserId("");
    setLoginRequestId("");
    setOtp("");
    setMessage("");
    setError("");
  }

  const isOtpStep = step === "otp";
  const stepNumber = step === "credentials" ? "01" : isOtpStep ? "02" : "03";

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel__intro">
          <p className="auth-panel__eyebrow">Dashboard General</p>
          <h1 id="auth-title">Tu espacio de proyectos.</h1>
          <p>Organiza tus proyectos y cursos desde un solo lugar.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card__heading">
            <span className="auth-card__step">{stepNumber}</span>
            <div>
              <h2>{step === "credentials" ? "Iniciar sesión" : isOtpStep ? "Verifica tu acceso" : step === "waiting" ? "Aprobación en curso" : "Acceso no disponible"}</h2>
              <p>{message || (step === "credentials" ? "Usa tus credenciales para continuar." : "Sigue las indicaciones para continuar.")}</p>
            </div>
          </div>

          {step === "waiting" ? (
            <div className="auth-card__status">
              <span className="auth-card__pulse" aria-hidden="true" />
              <small>Comprobamos el estado automáticamente cada 4 segundos.</small>
              <button type="button" className="auth-card__secondary" onClick={restart}>Usar otra cuenta</button>
            </div>
          ) : step === "denied" ? (
            <div className="auth-card__status">
              <button type="button" className="auth-card__submit" onClick={restart}>Intentar de nuevo</button>
            </div>
          ) : (
            <form className="auth-card__form" onSubmit={handleSubmit}>
              {step === "credentials" ? (
                <>
                  <label className="auth-card__field"><span>Correo electrónico</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correo.com" autoComplete="email" required /></label>
                  <label className="auth-card__field"><span>Contraseña</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tu contraseña" autoComplete="current-password" minLength={6} required /></label>
                </>
              ) : (
                <label className="auth-card__field"><span>Código OTP</span><input type="text" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" autoComplete="one-time-code" minLength={6} maxLength={6} required /></label>
              )}
              {error && <p className="auth-card__error" role="alert">{error}</p>}
              <button type="submit" className="auth-card__submit" disabled={isSubmitting}>{isSubmitting ? "Comprobando..." : isOtpStep ? "Verificar código" : "Continuar"}</button>
              {isOtpStep && isApiConfigured && <button type="button" className="auth-card__secondary" onClick={handleResendOtp}>Reenviar código</button>}
              {isOtpStep && <button type="button" className="auth-card__secondary" onClick={restart}>Usar otra cuenta</button>}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof AuthApiError && error.status === 404) return "Solicitud no encontrada.";
  return error instanceof Error ? error.message : "No se pudo completar el acceso.";
}