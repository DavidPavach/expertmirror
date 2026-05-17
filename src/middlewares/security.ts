import type { FastifyReply, FastifyRequest } from "fastify";
import { getAdminById } from "../modules/admin/service.js";
import { getUserById } from "../modules/user/service.js";
import { sendResponse } from "../utils/response.utils.js";

// Check for Suspension
export const isSuspended = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	// Ensure the route is only handling standard Users
	if (request.user.type !== "User") return;

	const user = await getUserById(request.user.id);

	if (!user) {
		return sendResponse(
			reply,
			404,
			false,
			"Oops—we can't find your account right now.",
		);
	}

	if (user.suspended) {
		return sendResponse(
			reply,
			403,
			false,
			"Suspended users can't perform this action.",
		);
	}
};

// Ensure the requester is a user
export const isUser = async (request: FastifyRequest, reply: FastifyReply) => {
	// Check basic token type
	if (request.user.type !== "User") {
		return sendResponse(
			reply,
			403,
			false,
			"Access denied. User privileges required.",
		);
	}

	// Verify specific role in the database
	const user = await getUserById(request.user.id);

	if (!user) {
		return sendResponse(
			reply,
			403,
			false,
			"Access denied. User privileges required.",
		);
	}
};

// Ensure the requester is an admin
export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
	// Check basic token type
	if (request.user.type !== "Admin") {
		return sendResponse(
			reply,
			403,
			false,
			"Access denied. Admin privileges required.",
		);
	}

	// Verify specific role in the database
	const admin = await getAdminById(request.user.id);

	if (!admin) {
		return sendResponse(
			reply,
			403,
			false,
			"Access denied. Admin privileges required.",
		);
	}
};

// Ensures the requester is an Admin with the "SUPER_ADMIN" role.
export const isSuperAdmin = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	console.log("The User", request.user);
	// Check basic token type
	if (request.user.type !== "Admin") {
		return sendResponse(
			reply,
			403,
			false,
			"Access denied. Admin privileges required.",
		);
	}

	// Verify specific role in the database
	const admin = await getAdminById(request.user.id);

	if (!admin || admin.role !== "SUPER_ADMIN") {
		return sendResponse(
			reply,
			403,
			false,
			"Access denied. Super Admin privileges required.",
		);
	}
};
