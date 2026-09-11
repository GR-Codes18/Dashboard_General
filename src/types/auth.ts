export type UserRole = "ANALISTA" | "TRABAJADOR";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface AuthSession {
	token: string;
	user: AuthUser;
}

export interface LoginResponse {
	message?: string;
	loginRequestId?: string;
	email?: string;
	userId?: string;
	id?: string;
	trabajadorId?: string;
	data?: {
		userId?: string;
		id?: string;
	};
	user?: AuthUser;
}

export type LoginRequestStatus = "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "EXPIRADA";

export interface LoginRequestStatusResponse {
	estado: LoginRequestStatus;
	userId?: string;
	id?: string;
	trabajadorId?: string;
	data?: {
		userId?: string;
		id?: string;
	};
}

export interface CreatedWorker {
	id: string;
	name: string;
	email: string;
	role: "TRABAJADOR";
	passwordInicial: string;
}

export function isAuthUser(value: unknown): value is AuthUser {
	if (!value || typeof value !== "object") return false;
	const user = value as Partial<AuthUser>;

	return Boolean(
		user.id &&
			user.name &&
			user.email &&
			(user.role === "ANALISTA" || user.role === "TRABAJADOR"),
	);
}

export function isAuthSession(value: unknown): value is AuthSession {
	if (!value || typeof value !== "object") return false;
	const session = value as Partial<AuthSession>;
	return Boolean(session.token && isAuthUser(session.user));
}
