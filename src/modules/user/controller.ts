import type { FastifyReply, FastifyRequest } from "fastify";

import { sendResponse } from "../../utils/response.utils.js";
import { deleteSession } from "../auth/service.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import type {
	AdminSuspendInput,
	AdminUpdateUserInput,
	CreateUserInput,
	UpdateUserInput,
} from "./schema.js";
import * as UserService from "./service.js";

// Create New User
export const RegisterUserHandler = async (
	request: FastifyRequest<{ Body: CreateUserInput }>,
	reply: FastifyReply,
) => {
	const body = await request.body;

	// Create user and return
	await UserService.createUser(body);
	sendResponse(reply, 201, true, "User registered successfully");
};

// Update User Details
export const UpdateUserHandler = async (
	request: FastifyRequest<{ Body: UpdateUserInput }>,
	reply: FastifyReply,
) => {
	const userId = "";
	const body = request.body;

	// Update user and return
	await UserService.updateUser(userId, body);

	return sendResponse(reply, 200, true, "User profile updated successfully");
};

// Fetch Current User
export const CurrentUserHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const userId = request.user.id;

	// Fetch User and Return
	const user = await UserService.getUserById(userId);

	if (!user) {
		return sendResponse(reply, 404, false, "User not found");
	}

	return sendResponse(
		reply,
		200,
		true,
		"User Details was fetched successfully",
		user,
	);
};

// Admin

// Suspend User
export const SuspendUserHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: AdminSuspendInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;
	const duration = request.body.duration;

	// Suspend user, log them out and return response
	await UserService.suspendUser(id, duration);
	await deleteSession(id);

	return sendResponse(reply, 200, true, "User was suspended successfully");
};

// Update User Details
export const AdminUpdateUserHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: AdminUpdateUserInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;
	const body = request.body;

	// Update user and return
	await UserService.adminUpdateUser(id, body);
	return sendResponse(reply, 200, true, "User profile updated successfully");
};

// Get User By Id
export const GetUserProfileHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const { id } = request.params;
	const user = await UserService.getUserById(id);

	if (!user) {
		return sendResponse(reply, 404, false, "User not found");
	}

	return sendResponse(
		reply,
		200,
		true,
		"User Details was fetched successfully",
		user,
	);
};

// Fetch All Users
export const GetAllUsersHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const { page, limit } = request.query;

	// Fetch Users and Return
	const result = await UserService.getPaginatedUsers(page, limit);
	return sendResponse(
		reply,
		200,
		true,
		"Users were fetched successfully",
		result,
	);
};
