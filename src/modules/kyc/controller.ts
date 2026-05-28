import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import { notify } from "../../utils/socket.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import type { CreateKycInput, UpdateKycInput } from "./schema.js";
import * as KycService from "./service.js";

// Create new KYC for User
export const SubmitKycHandler = async (
	request: FastifyRequest<{ Body: CreateKycInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;
	const userId = request.user.id;

	// Create KYC , Notify and return
	await KycService.submitKyc(userId, body);

	notify({
		userId: userId,
		trigger: "KYC",
		save: true,
		data: {
			title: "KYC Submitted",
			message: `Your KYC application has been submitted successfully.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 201, true, "KYC submitted successfully");
};

// Get User KYC
export const FetchKycHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const userId = request.user.id;

	// Fetch KYC and return
	const kyc = await KycService.getKyc(userId);
	return sendResponse(
		reply,
		200,
		true,
		"User KYC was fetched successfully",
		kyc,
	);
};

// Admin

// Fetch a User KYC
export const FetchAUserKycHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;

	// Fetch KYC and return
	const kyc = await KycService.getKyc(id);
	return sendResponse(
		reply,
		200,
		true,
		"User KYC was fetched successfully",
		kyc,
	);
};

// Fetch All KYC
export const GetAllKycsHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const { page, limit } = request.query;

	// Fetch Kycs and return
	const result = await KycService.getPaginatedKycs(page, limit);
	return sendResponse(
		reply,
		200,
		true,
		"User KYCs were fetched successfully",
		result,
	);
};

// Update User KYC
export const UpdateKycHandler = async (
	request: FastifyRequest<{
		Params: IdInput;
		Body: UpdateKycInput;
	}>,
	reply: FastifyReply,
) => {
	const { id } = request.params;
	const body = request.body;

	// Update KYC and return
	const updatedKyc = await KycService.updateKycById(id, body);

	notify({
		userId: updatedKyc.user.toString(),
		trigger: "KYC",
		save: true,
		data: {
			title: "KYC Update",
			message: `Your KYC application has an update, kindly review it.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 200, true, "KYC updated successfully", updatedKyc);
};

// DELETE User KYC
export const DeleteKycHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const { id } = request.params;

	// Delete KYC, Notify and return
	const deletedKyc = await KycService.deleteKycById(id);

	notify({
		userId: deletedKyc.user.toString(),
		trigger: "KYC",
		save: true,
		data: {
			title: "KYC Deleted",
			message: `Your KYC application has been deleted, due to not reaching the company's requirements, kindly restart the process.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 200, true, "KYC record deleted successfully");
};
