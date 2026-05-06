import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const setupSwagger = async (app: FastifyInstance) => {
	await app.register(fastifySwagger, {
		transform: jsonSchemaTransform,
		openapi: {
			info: {
				title: "Expert Mirror API",
				description: "API documentation for Expert Mirror API Endpoint",
				version: "1.0.0",
			},
			servers: [
				{
					url: "http://localhost:3000",
					description: "Local server",
				},
			],
			tags: [
				{ name: "Users", description: "User related endpoints" },
				{ name: "Auth", description: "Authentication related endpoints" },
				{ name: "General", description: "Generally used endpoints" },
				{ name: "Admins", description: "Admin related endpoints" },
				{ name: "KYCs", description: "KYC related endpoints" },
				{ name: "Referrals", description: "Referral related endpoints" },
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
	});

	await app.register(fastifySwaggerUI, {
		routePrefix: "/documentation",
		uiConfig: {
			docExpansion: "list",
			deepLinking: true,
		},
		staticCSP: true,
	});
};
