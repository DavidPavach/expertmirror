/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { AppError } from "../../utils/error.js";
import NotificationModel from "./model.js";

// Save Notification
export const createSavedNotification = async (
	userId: string,
	trigger: string,
	data: { title: string; message: string; type: string },
) => {
	const notification = await NotificationModel.create({
		user: userId,
		trigger: trigger as any,
		title: data.title,
		message: data.message,
		type: data.type as any,
	});

	return notification;
};

// Get User Notifications
export const getUserNotifications = async (
	userId: string,
	page: number = 1,
	limit: number = 50,
) => {
	const skip = (page - 1) * limit;

	const [notifications, unreadCount, totalDocs] = await Promise.all([
		NotificationModel.find({ user: userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		NotificationModel.countDocuments({ user: userId, isRead: false }),
		NotificationModel.countDocuments({ user: userId }),
	]);

	return {
		data: notifications,
		pagination: {
			total: totalDocs,
			page,
			limit,
			totalPages: Math.ceil(totalDocs / limit),
			unreadCount,
		},
	};
};

// Mark Notification as Read
export const markAsRead = async (notificationId: string) => {
	return await NotificationModel.findByIdAndUpdate(
		notificationId,
		{ isRead: true },
		{ returnDocument: "after" },
	);
};

// Delete Notification
export const deleteNotification = async (notificationId: string) => {
	const result = await NotificationModel.findByIdAndDelete(notificationId);
	if (!result)
		throw new AppError("Notification not found", { statusCode: 404 });
	return true;
};
