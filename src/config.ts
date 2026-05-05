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

	ENCRYPTION_KEY: z.string(),
	ENCRYPTION_IV: z.string(),

	AWS_BUCKET_REGION: z.string(),
	AWS_BUCKET_NAME: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
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
	ENCRYPTION_KEY,
	ENCRYPTION_IV,
	AWS_BUCKET_REGION,
	AWS_BUCKET_NAME,
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
} = parsedEnv;
