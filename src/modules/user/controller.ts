import type { FastifyReply, FastifyRequest } from "fastify";
import { customAlphabet } from "nanoid";
import generalTemplate from "../../emails/admin/general.js";
import forgotPassword from "../../emails/user/forgotPassword.js";
import welcome from "../../emails/user/welcome.js";
import { sendAdminEmail, sendEmail } from "../../libs/mailer.js";
import { sendResponse } from "../../utils/response.utils.js";
import { notify } from "../../utils/socket.js";
import { deleteSession } from "../auth/service.js";
import type {
	IdInput,
	IdStringInput,
	PaginationInput,
} from "../general/schema.js";
import { getKyc } from "../kyc/service.js";
import { createReferral } from "../referral/service.js";
import type {
	AdminSuspendInput,
	AdminUpdateUserInput,
	CreateUserInput,
	PasswordResetEmailInput,
	ResetPasswordInput,
	UpdateUserInput,
	VerifyPasswordResetInput,
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
		notify({
			userId: referrerUser._id.toString(),
			trigger: "REFERRAL",
			save: true,
			data: {
				title: "New Referral! 🎉",
				message: `Your referral ${newUser.username} has just created an account.`,
				type: "INFO",
			},
		});
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
			subject: "Welcome to Expertmirrorcon",
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

	// Update user, notify and return
	await UserService.updateUser(userId, body);
	notify({
		userId,
		trigger: "SYSTEM",
		save: false,
		data: {
			title: "Profile Updated! 📝",
			message: "Your profile has been updated successfully.",
			type: "SUCCESS",
		},
	});

	return sendResponse(reply, 200, true, "User profile updated successfully");
};

// Fetch Current User
export const CurrentUserHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const userId = request.user.id;

	// Fetch User, KYC and Return
	const user = await UserService.getUserById(userId);
	const kyc = await getKyc(userId);

	if (!user) {
		return sendResponse(reply, 404, false, "User not found");
	}

	return sendResponse(
		reply,
		200,
		true,
		"User Details was fetched successfully",
		{ ...user, kycStatus: !kyc ? "NOT STARTED" : kyc.status },
	);
};

// Send Password Reset OTP
export const SendPasswordResetHandler = async (
	request: FastifyRequest<{ Body: PasswordResetEmailInput }>,
	reply: FastifyReply,
) => {
	const { email } = request.body;

	// Fetch user by email, throw an error if it doesn't exist, or if the user hasn't verified their account
	const user = await UserService.getUser(email.toLowerCase());
	if (!user) return sendResponse(reply, 400, false, "Incorrect Email");

	// Generate 6 Random Digits and Save
	const randomSixNumbers = customAlphabet("0123456789", 6)();

	// Save the number to the database
	user.passwordResetCode = randomSixNumbers;
	await user.save();

	// Send email to the email address with the 4 Digit
	const emailContent = forgotPassword({
		name: user.username,
		verificationCode: randomSixNumbers,
	});
	await sendEmail({
		to: user.email,
		subject: "Reset Password Verification",
		html: emailContent.html,
	});

	return sendResponse(
		reply,
		200,
		true,
		"A verification code will be sent if the email is associated with an account.",
	);
};

// Verify Password Reset OPT
const otpStorage = new Map();

export const VerifyPasswordResetHandler = async (
	request: FastifyRequest<{ Body: VerifyPasswordResetInput }>,
	reply: FastifyReply,
) => {
	const { email, otp } = request.body;

	// Fetch user and throw an error if user doesn't exist or entered a wrong OTP
	const user = await UserService.getUser(email);
	if (!user) return sendResponse(reply, 400, false, "User does not exist");
	if (user.passwordResetCode !== otp)
		return sendResponse(reply, 400, false, "Incorrect OTP");

	// Make the user password field null again
	user.passwordResetCode = "000000";
	await user.save();
	otpStorage.set(email, email);

	return sendResponse(reply, 200, true, "Email was verified successfully.");
};

// Create new password
export const PasswordResetHandler = async (
	request: FastifyRequest<{ Body: ResetPasswordInput }>,
	reply: FastifyReply,
) => {
	const { email, password } = request.body;
	const user = await UserService.getUser(email);

	if (!user) return sendResponse(reply, 400, false, "User does not exist");

	// Check if the User has been verified
	if (!otpStorage.has(email))
		return sendResponse(
			reply,
			400,
			false,
			"Something went wrong kindly restart the password reset process.",
		);

	// Save users new password
	user.password = password;
	await user.save();

	notify({
		userId: user._id.toString(),
		trigger: "SYSTEM",
		save: false,
		data: {
			title: "Password Updated!",
			message: "Your Password has been updated successfully.",
			type: "SUCCESS",
		},
	});

	return sendResponse(
		reply,
		200,
		true,
		"Your password was updated successfully.",
	);
};

// Admin

// Suspend User
export const SuspendUserHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: AdminSuspendInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;
	const { suspended, duration } = request.body;

	// Suspend user, log them out and return response
	await UserService.suspendUser(id, { suspended, duration });
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
	notify({
		userId: id,
		trigger: "SYSTEM",
		save: false,
		data: {
			title: "Profile Updated! 📝",
			message: "Your profile has been updated successfully.",
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 200, true, "User profile updated successfully");
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

// Fetch A User
export const GetAUserHandler = async (
	request: FastifyRequest<{ Params: IdStringInput }>,
	reply: FastifyReply,
) => {
	const identifier = request.params.identifier;

	// Fetch User and return
	const user = await UserService.findUserByIdentifier(identifier);
	if (!user) return sendResponse(reply, 404, false, "User Not Found");

	return sendResponse(reply, 200, true, "User Fetched", user);
};
