import type { FastifyReply, FastifyRequest } from "fastify";

import generalTemplate from "../../emails/admin/general.js";
import login from "../../emails/user/login.js";
import { sendAdminEmail, sendEmail } from "../../libs/mailer.js";
import { formatWithTimezone } from "../../utils/format.js";
import { sendResponse } from "../../utils/response.utils.js";
import { getAdminByEmail } from "../admin/service.js";
import * as UserService from "../user/service.js";
import type { LoginInput } from "./schema.js";
import * as AuthService from "./service.js";

// Fetch user location
const FALLBACK: LocationInfo = {
	city: "Unknown",
	region: "Unknown",
	country: "Unknown",
	timezone: "UTC",
};

const normalizeIp = (ip: string): string => ip.replace("::ffff:", "").trim();

const isPrivateIp = (ip: string): boolean =>
	ip === "127.0.0.1" ||
	ip === "::1" ||
	ip.startsWith("10.") ||
	ip.startsWith("192.168.") ||
	ip.startsWith("172.16.");

export const getLocationFromIP = async (ip: string): Promise<LocationInfo> => {
	if (!ip) return FALLBACK;

	const normalizedIp = normalizeIp(ip);
	if (isPrivateIp(normalizedIp)) return FALLBACK;

	try {
		const res = await fetch(`https://ipwho.is/${normalizedIp}`, {
			headers: { "User-Agent": "kyc-service/1.0" },
		});

		if (!res.ok) return FALLBACK;

		const data = (await res.json()) as IpWhoIsResponse;
		if (!data.success) return FALLBACK;

		return {
			city: data.city ?? "Unknown",
			region: data.region ?? "Unknown",
			country: data.country ?? "Unknown",
			timezone: data.timezone?.id ?? "UTC",
		};
	} catch {
		return FALLBACK;
	}
};

// Authenticate a user
export const LoginHandler = async (
	request: FastifyRequest<{ Body: LoginInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;
	const ipAddress = request.ip;

	// Fetch User Details
	const user = await UserService.getUser(body.identifier);
	if (!user)
		return sendResponse(reply, 404, false, "Incorrect Username or Password");

	// Compare password
	const isCorrect = await user.comparePassword(body.password);

	if (isCorrect) {
		//Get location details from IP Address
		const loginDetails = await getLocationFromIP(ipAddress);
		console.log("IP Address Response", loginDetails);

		// Create Auth
		const result = await AuthService.loginUser(
			user._id.toString(),
			{ device: body.device, rememberMe: body.rememberMe },
			ipAddress,
			"User",
		);

		// Calculate the max-age for the cookie in seconds
		const maxAgeInSeconds = Math.floor(
			(result.expiresAt.getTime() - Date.now()) / 1000,
		);

		// Set the HTTP-Only cookie with the secure JTI
		reply.setCookie("jti", result.jti, {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "none",
			maxAge: maxAgeInSeconds,
		});

		// User Email Notification
		const loginTemplate = login({
			name: user.username,
			ip: ipAddress,
			userAgent: body.device.ua || "Unknown",
			location: loginDetails,
			date: formatWithTimezone(loginDetails.timezone),
		}).html;

		// Admin Email Notification
		const adminTemplate = generalTemplate({
			action: "User Login",
			message: `The user with the email ${user.email} and username ${user.username} just logged into their account`,
			name: user.username,
			email: user.email,
			accountId: user.accountId,
			ip: ipAddress,
			location: loginDetails,
		}).html;

		await Promise.allSettled([
			sendEmail({
				to: user.email,
				subject: "New Login to Your Expertmirrorcon Account",
				html: loginTemplate,
			}),
			sendAdminEmail(adminTemplate),
		]);

		// Send the success response
		return sendResponse(reply, 200, true, "Login Successful");
	} else {
		return sendResponse(reply, 400, false, "Incorrect Email or Password");
	}
};

// Logout a User
export const LogoutHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const jti = request.cookies?.jti;

	if (jti) {
		await AuthService.logoutUser(jti);
	}

	reply.clearCookie("jti", { path: "/" });

	// Return a response
	return sendResponse(reply, 200, true, "Logged out successfully");
};

// Admin

// Auth an Admin
export const AuthAdminHandler = async (
	request: FastifyRequest<{ Body: LoginInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;
	const ipAddress = request.ip;

	// Fetch Admin Details
	const admin = await getAdminByEmail(body.identifier);
	if (!admin)
		return sendResponse(reply, 404, false, "Incorrect Username or Password");

	// Compare password
	const isCorrect = await admin.comparePassword(body.password);
	if (isCorrect) {
		// Create Auth
		await AuthService.loginUser(
			admin._id.toString(),
			{ device: body.device, rememberMe: body.rememberMe },
			ipAddress,
			"Admin",
		);

		return sendResponse(reply, 200, true, "Login Successful");
	} else {
		return sendResponse(reply, 400, false, "Incorrect Email or Password");
	}
};
