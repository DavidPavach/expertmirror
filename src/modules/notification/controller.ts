import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import type { CreateNotificationInput } from "./schema.js";
import * as NotificationService from "./service.js";

// Get User Notifications
export const GetNotificationsHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const page = Number(request.query.page) || 1;
	const limit = Number(request.query.limit) || 50;

	// Fetch Notifications and Return
	const data = await NotificationService.getUserNotifications(
		request.user.id,
		page,
		limit,
	);

	return sendResponse(reply, 200, true, "Notifications fetched", data);
};

// Mark Notification Handler
export const MarkNotificationReadHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	// Mark and return
	await NotificationService.markAsRead(request.params.id);
	return sendResponse(reply, 200, true, "Marked as read");
};

// Delete Notification
export const DeleteNotificationHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	// Delete and return
	await NotificationService.deleteNotification(request.params.id);
	return sendResponse(reply, 200, true, "Notification deleted");
};

// Admin

// Create New Notification
export const CreateNotificationHandler = async (
	request: FastifyRequest<{
		Body: CreateNotificationInput;
	}>,
	reply: FastifyReply,
) => {
	const { user, title, message, type, trigger } = request.body;
	// Create and return
	await NotificationService.createSavedNotification(user, trigger, {
		title,
		message,
		type,
	});
	return sendResponse(reply, 201, true, "Notification created");
};
