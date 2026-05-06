import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { IdInput } from "../general/schema.js";
import type { CreateAdminInput, UpdateAdminInput } from "./schema.js";
import * as AdminService from "./service.js";

// Create a new Admin
export const RegisterAdminHandler = async (
	request: FastifyRequest<{ Body: CreateAdminInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;

	// Create Admin and return a response
	await AdminService.createAdmin(body);
	return sendResponse(reply, 201, true, "Admin created successfully");
};

// Get Current Admin
export const GetAdminHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const adminId = request.user.id;

	// Fetch Admin and return
	const admin = await AdminService.getAdminById(adminId);
	return sendResponse(
		reply,
		200,
		true,
		"Admin Details was fetched successfully",
		admin,
	);
};

// Get All Admin
export const GetAdminsHandler = async (
	_: FastifyRequest,
	reply: FastifyReply,
) => {
	// Fetch Admins and Return
	const admins = await AdminService.getAllAdmin();
	return sendResponse(
		reply,
		200,
		true,
		"Admins were fetched successfully",
		admins,
	);
};

// Update an Admin
export const UpdateAdminHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: UpdateAdminInput }>,
	reply: FastifyReply,
) => {
	const { id } = request.params;
	const body = request.body;

	// Update Admin and Return
	await AdminService.updateAdmin(id, body);
	return sendResponse(reply, 200, true, "Admin profile updated successfully");
};

// Delete an Admin
export const DeleteAdminHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const { id } = request.params;

	// Delete Admin and Return
	await AdminService.deleteAdmin(id);
	return sendResponse(reply, 200, true, "The Admin was deleted successfully");
};
