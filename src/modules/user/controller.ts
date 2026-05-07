import type { FastifyReply, FastifyRequest } from "fastify";
import generalTemplate from "../../emails/admin/general.js";
import welcome from "../../emails/user/welcome.js";
import { sendAdminEmail, sendEmail } from "../../libs/mailer.js";
import { sendResponse } from "../../utils/response.utils.js";
import { deleteSession } from "../auth/service.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import { createReferral } from "../referral/service.js";
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
	const { referral, ...body } = request.body;
	let referrerUser = null;

	// Validate the referral code.
	if (referral && referral.length > 3) {
		referrerUser = await UserService.getUser(referral);

		if (!referrerUser) {
			// If the referral code is bad, stop the registration process
			return sendResponse(
				reply,
				400,
				false,
				"Invalid referral code. Referrer not found.",
			);
		}
	}

	// Create the User
	const newUser = await UserService.createUser(body);

	// Create Referral Document (if a valid referral was provided)
	if (referrerUser) {
		await createReferral(referrerUser._id.toString(), newUser._id.toString());
	}

	// Generate Email Templates
	const template = generalTemplate({
		action: "A New User Just Created An Account",
		message: `The user with the email ${newUser.email} and username ${newUser.username} just created a new account. Kindly login and continue.`,
		name: newUser.username,
		email: newUser.email,
		accountId: newUser.accountId,
	});

	const welcomeEmailContent = welcome({ name: newUser.username });

	// Send Emails Concurrently
	await Promise.allSettled([
		sendAdminEmail(template.html),
		sendEmail({
			to: newUser.email,
			subject: "Welcome to ExpertMirrorCon",
			html: welcomeEmailContent.html,
		}),
	]);

	// Send Success Response
	return sendResponse(reply, 201, true, "User registered successfully");
};

// Update User Details
export const UpdateUserHandler = async (
	request: FastifyRequest<{ Body: UpdateUserInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
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
