import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import plugin from "fastify-plugin";
import { validateSession } from "../modules/auth/service.js";
import { updateLastSession } from "../modules/user/service.js";
import { sendResponse } from "../utils/response.utils.js";

export const authPlugin = plugin(async (app: FastifyInstance) => {
	app.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				// Extract the jti from the HTTP-only cookie
				const jti = request.cookies?.jti;

				if (!jti) {
					return sendResponse(
						reply,
						401,
						false,
						"Missing authentication token",
					);
				}

				// Validate the session in the database
				const session = await validateSession(jti);

				if (!session) {
					// Clear the invalid cookie
					reply.clearCookie("jti", { path: "/" });
					return sendResponse(
						reply,
						401,
						false,
						"Session expired. Please log in again.",
					);
				}

				// Attach the user details to the request for the controllers to use
				request.user = {
					id: session.user.toString(),
					type: session.userType,
				};

				// Update the 'lastSession' activity for standard users
				if (session.userType === "User") {
					await updateLastSession(session.user.toString());
				}
			} catch (err) {
				request.log.error(`Auth Error: ${err}`);
				return sendResponse(reply, 401, false, "Unauthorized");
			}
		},
	);
});
