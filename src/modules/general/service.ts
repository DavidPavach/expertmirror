import crypto from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	AWS_ACCESS_KEY,
	AWS_BUCKET_NAME,
	AWS_BUCKET_REGION,
	AWS_SECRET_ACCESS_KEY,
} from "../../config.js";
import type { PresignRequestInput } from "./schema.js";

// Initialize the S3 Client once
const s3Client = new S3Client({
	region: AWS_BUCKET_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});

// Generates presigned URLs for a batch of files
export const generatePresignedUrls = async (
	userId: string,
	input: PresignRequestInput,
) => {
	const bucketName = AWS_BUCKET_NAME;

	const promises = input.items.map(async (item) => {
		const uniqueId = crypto.randomUUID();
		const objectKey = `${userId}/${uniqueId}-${item.fileName}`;

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: objectKey,
			ContentType: item.contentType,
		});

		// Generate the presigned URL valid for 3 minutes (180 seconds)
		const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 180 });
		const publicUrl = `https://${bucketName}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${objectKey}`;

		return {
			uploadUrl,
			publicUrl,
			objectKey,
			fileName: item.fileName,
		};
	});

	return await Promise.all(promises);
};
