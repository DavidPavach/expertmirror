import type { Server as HTTPServer } from "http";
import { Server } from "socket.io";

// Services
import {
	createSavedNotification,
	getUserNotifications,
} from "./../modules/notification/service.js";

let io: Server | undefined;
const allowedOrigins = ["http://localhost:5173", "https://expertmirrorcon.com"];

export const initSocket = (server: HTTPServer) => {
	io = new Server(server, {
		cors: {
			origin: (origin, cb) => {
				// When origin is undefined (like with some native clients or same-origin), allow it
				if (!origin || allowedOrigins.includes(origin)) {
					cb(null, true);
				} else {
					cb(new Error("Not allowed by CORS"));
				}
			},
			credentials: true,
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);

		socket.on("joinRoom", async (user: string) => {
			if (!user?.trim()) return;
			socket.join(user);

			try {
				// When a user joins, immediately send them their notifications
				const userNotifications = await getUserNotifications(user, 1, 50);
				io?.to(user).emit("allNotifications", userNotifications);
			} catch (err) {
				console.error("Failed to fetch/send user notifications:", err);
			}

			console.log(`User ${user} joined room ${user}`);
		});

		socket.on("disconnect", () => {
			console.log("Socket disconnected:", socket.id);
		});
	});
};

// Function to emit and save a user's notification
export const notify = async ({
	userId,
	trigger,
	save,
	data,
}: {
	userId: string;
	trigger: string;
	save: boolean;
	data: { title: string; message: string; type: string };
}) => {
	if (save) {
		const notification = await createSavedNotification(userId, trigger, data);
		// Emit to the user's room if socket server is initialized
		if (io) {
			io.to(userId).emit("notification", notification);
		}
	}
	if (io) {
		// Emit to the user's room if socket server is initialized
		const notification = {
			user: userId,
			trigger,
			title: data.title,
			message: data.message,
			type: data.type,
			createdAt: new Date(),
			isRead: false,
		};
		io.to(userId).emit("notification", notification);
	}
};
