import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables
dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.string(),
	COOKIE_SECRET: z.string(),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string(),

	FROM_EMAIL: z.string(),
	REPLY_EMAIL: z.string(),
	RESEND_API: z.string(),
	ADMIN_EMAIL: z.email(),

	AWS_BUCKET_REGION: z.string(),
	AWS_BUCKET_NAME: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),

	COINGECKO_API_KEY: z.string(),
});

// Validate the environment variables
const parsedEnv = envSchema.parse(process.env);

// Export validated variables
export const {
	NODE_ENV,
	COOKIE_SECRET,
	PORT,
	DATABASE_URL,
	FROM_EMAIL,
	REPLY_EMAIL,
	RESEND_API,
	ADMIN_EMAIL,
	AWS_BUCKET_REGION,
	AWS_BUCKET_NAME,
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	COINGECKO_API_KEY,
} = parsedEnv;
