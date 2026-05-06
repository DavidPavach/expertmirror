export interface AppErrorOptions {
	statusCode?: number;
	code?: string;
	cause?: unknown;
}

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code?: string;
	public override readonly cause?: unknown;

	constructor(message: string, options: AppErrorOptions = {}) {
		super(message);

		this.name = "AppError";
		this.statusCode = options.statusCode ?? 500;
		this.code = options.code;
		this.cause = options.cause;

		Error.captureStackTrace?.(this, this.constructor);
	}
}
