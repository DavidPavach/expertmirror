// Utils
import { AppError } from "../../utils/error.js";

import UserModel from "./model.js";

// Schemas
import type {
	AdminUpdateUserInput,
	CreateUserInput,
	UpdateUserInput,
} from "./schema.js";

// CREATE: Register a new user
export const createUser = async (input: CreateUserInput) => {
	// Check if email or username already exists
	const existingUser = await UserModel.findOne({
		$or: [{ email: input.email }, { username: input.username }],
	});

	if (existingUser) {
		throw new AppError("User with this email or username already exists", {
			statusCode: 403,
		});
	}

	// Create the user and return
	const newUser = await UserModel.create(input);
	return newUser;
};

// READ: Fetches a user by their ID
export const getUserById = async (userId: string) => {
	return await UserModel.findById(userId).select("-password");
};

// READ: Fetch a user using either email or username
export const getUser = async (identifier: string) => {
	const existingUser = await UserModel.findOne({
		$or: [{ email: identifier }, { username: identifier }],
	});
	return existingUser;
};

// UPDATE: Update a users details
export const updateUser = async (
	userId: string,
	updateData: UpdateUserInput,
) => {
	const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
		new: true,
		runValidators: true,
	}).select("-password");

	if (!updatedUser) {
		throw new AppError("User not found", { statusCode: 404 });
	}

	return updatedUser;
};

// UPDATE: Update a users last session
export const updateLastSession = async (userId: string) => {
	const updatedUser = await UserModel.findByIdAndUpdate(
		userId,
		{ lastSession: new Date() },
		{
			new: true,
			runValidators: true,
		},
	).select("-password");

	if (!updatedUser) {
		throw new AppError("User not found", { statusCode: 404 });
	}

	return updatedUser;
};

// Admin Services

// UPDATE: Handles the suspension logic
export const suspendUser = async (userId: string, durationInDays: number) => {
	const user = await UserModel.findByIdAndUpdate(
		userId,
		{
			suspended: true,
			suspendedDate: new Date(),
			suspensionDuration: durationInDays,
		},
		{ new: true },
	).select("-password");

	if (!user) throw new AppError("User not found", { statusCode: 404 });
	return user;
};

// UPDATE: Handles the users update
export const adminUpdateUser = async (
	userId: string,
	updateData: AdminUpdateUserInput,
) => {
	if (updateData.email || updateData.username) {
		const existingUser = await UserModel.findOne({
			_id: { $ne: userId },
			$or: [
				...(updateData.email ? [{ email: updateData.email }] : []),
				...(updateData.username ? [{ username: updateData.username }] : []),
			],
		});

		if (existingUser) {
			throw new AppError(
				"The requested email or username is already in use by another account.",
				{ statusCode: 409 },
			);
		}
	}

	const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
		new: true,
		runValidators: true,
	}).select("-password");

	if (!updatedUser) {
		throw new AppError("User not found", { statusCode: 404 });
	}

	return updatedUser;
};

// READ ALL: Fetches a paginated list of users
export const getPaginatedUsers = async (page: number, limit: number) => {
	const skip = (page === 0 ? 0 : page - 1) * limit;

	const [users, totalDocuments] = await Promise.all([
		UserModel.find()
			.select("-password")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		UserModel.countDocuments(),
	]);

	// Calculate the total number of pages
	const totalPages = Math.ceil(totalDocuments / limit);

	return {
		data: users,
		pagination: {
			total: totalDocuments,
			page,
			limit,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};
