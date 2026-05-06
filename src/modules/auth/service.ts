import crypto from "crypto";
import AuthModel from "./model.js";

// Schemas
import type { ServiceInput } from "./schema.js";

// CREATE: Login User
export const loginUser = async (
	userId: string,
	input: ServiceInput,
	ipAddress?: string,
	userType: "User" | "Admin" = "User",
) => {
	// Enforce Single Session
	await AuthModel.deleteMany({ user: userId });

	// Calculate Expiration based on 'rememberMe'
	const ONE_DAY_MS = 24 * 60 * 60 * 1000;
	const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;
	const duration = input.rememberMe ? SEVEN_DAYS_MS : ONE_DAY_MS;
	const expiresAt = new Date(Date.now() + duration);

	// Generate a secure JTI
	const jti = crypto.randomUUID();

	// Create the new session with device details
	const session = await AuthModel.create({
		user: userId,
		userType,
		jti,
		ip: ipAddress,
		expiresAt,
		device: input.device,
	});

	return { jti: session.jti, expiresAt: session.expiresAt };
};

// READ: Validates a JTI from the cookie to ensure the session is active.
export const validateSession = async (jti: string) => {
	const session = await AuthModel.findOne({ jti }).populate("user");

	if (!session) return null;

	if (new Date() > session.expiresAt) {
		await AuthModel.deleteOne({ _id: session._id });
		return null;
	}

	return session;
};

// DELETE: Logs a user out by destroying their specific session.
export const logoutUser = async (jti: string) => {
	const result = await AuthModel.deleteOne({ jti });
	return result.deletedCount > 0;
};

// DELETE: Logs a user out (suspension use case)
export const deleteSession = async (userId: string) => {
	const result = await AuthModel.deleteOne({ user: userId });
	return result.deletedCount > 0;
};
