import { isAuthSession, isAuthUser, type CreatedWorker, type LoginRequestStatusResponse, type LoginResponse } from "../types/auth";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");

export const isApiConfigured = Boolean(API_URL);

interface ApiErrorBody {
	message?: string;
}

export class AuthApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "AuthApiError";
		this.status = status;
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	if (!API_URL) throw new AuthApiError("La API de autenticación no está configurada.", 0);

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: { "Content-Type": "application/json", ...options.headers },
	});
	const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

	if (!response.ok) {
		throw new AuthApiError(body.message || "No se pudo completar la solicitud.", response.status);
	}

	return body;
}

export function login(email: string, password: string) {
	return request<LoginResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

export async function verifyOtp(userId: string, code: string) {
	const response = await request<unknown>("/auth/verify-otp", {
		method: "POST",
		body: JSON.stringify({ userId, code }),
	});

	if (!isAuthSession(response)) {
		throw new AuthApiError("La respuesta de verify-otp no contiene una sesión válida.", 502);
	}

	return response;
}

export async function getMe(token: string) {
	const response = await request<unknown>("/auth/me", {
		headers: { Authorization: `Bearer ${token}` },
	});
	const user = response && typeof response === "object" && "user" in response ? response.user : response;

	if (!isAuthUser(user)) {
		throw new AuthApiError("La respuesta de /auth/me no contiene un usuario válido.", 502);
	}

	return user;
}

export function resendOtp(userId: string) {
	return request<{ message?: string }>("/auth/resend-otp", {
		method: "POST",
		body: JSON.stringify({ userId }),
	});
}

export function getLoginRequestStatus(loginRequestId: string, email: string) {
	const query = new URLSearchParams({ email });
	return request<LoginRequestStatusResponse>(`/auth/login-requests/${encodeURIComponent(loginRequestId)}/estado?${query.toString()}`);
}

export function createWorker(token: string, worker: { name: string; email: string; password: string }) {
	return request<{ trabajador: CreatedWorker }>("/auth/crear-trabajador", {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(worker),
	});
}
