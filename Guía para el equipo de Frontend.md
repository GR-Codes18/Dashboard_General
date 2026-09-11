# Guía para el equipo de Frontend: Sistema de Roles y Flujo de Login

## 1. Roles

- **Analista:** usuario único del sistema. Inicia sesión con credenciales y OTP por correo.
- **Trabajador:** lo crea el Analista. Cada login requiere aprobación del Analista desde el correo antes de enviar el OTP.

Todos los endpoints usan el prefijo `/auth`.

## 2. Analista

1. `POST /auth/login` con `{ "email": "...", "password": "..." }`.
2. `POST /auth/verify-otp` con `{ "userId": "...", "code": "123456" }`.
3. La respuesta debe ser `{ "token": "...", "user": { "id": "...", "name": "...", "email": "...", "role": "ANALISTA" } }`.

El token se envía en requests protegidos:

```http
Authorization: Bearer <token>
```

## 3. Trabajador

### Login y aprobación

`POST /auth/login` recibe email y contraseña. Si son correctos, responde `202` con:

```json
{
  "message": "Tu solicitud de acceso fue enviada. Espera la aprobación del Analista.",
  "loginRequestId": "uuid-de-la-solicitud",
  "email": "trabajador@ejemplo.com"
}
```

El frontend conserva `loginRequestId` y `email` únicamente en el estado de React.

Consulta el estado cada 3-5 segundos:

```http
GET /auth/login-requests/:id/estado?email=trabajador@ejemplo.com
```

Estados:

| Estado | Acción del frontend |
| --- | --- |
| `PENDIENTE` | Mostrar espera y continuar polling. |
| `ACEPTADA` | Detener polling y mostrar OTP. |
| `RECHAZADA` | Detener polling y mostrar acceso denegado. |
| `EXPIRADA` | Detener polling y pedir un nuevo login. |

Cuando sea `ACEPTADA`, usa `POST /auth/verify-otp` con el `userId` del login o del endpoint de estado y el código recibido por correo. La respuesta incluye `role: "TRABAJADOR"`.

Un `404` del estado significa `Solicitud no encontrada`.

## 4. Crear Trabajadores

Solo el Analista usa:

```http
POST /auth/crear-trabajador
Authorization: Bearer <token-del-analista>
```

```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "passwordInicial123"
}
```

La respuesta `201` incluye el objeto `trabajador` y `passwordInicial`. El Analista debe compartir esa contraseña fuera del sistema.

- `401`: falta el token o la sesión no es válida.
- `403`: el usuario no es Analista.
- `409`: el correo ya existe.

## 5. Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `/auth/register` | Setup inicial del Analista. |
| `POST` | `/auth/login` | Analista y Trabajador. |
| `POST` | `/auth/verify-otp` | Analista y Trabajador. |
| `POST` | `/auth/resend-otp` | Analista y Trabajador. |
| `GET` | `/auth/me` | Validar JWT y obtener rol. |
| `POST` | `/auth/crear-trabajador` | Solo Analista. |
| `GET` | `/auth/login-requests/:id/estado` | Polling del Trabajador. |
| `GET` | `/auth/login-requests/:id/aceptar` | Link del correo del Analista. |
| `GET` | `/auth/login-requests/:id/rechazar` | Link del correo del Analista. |

Los links de aceptar y rechazar se abren desde el correo del Analista; el frontend no los consume directamente.
