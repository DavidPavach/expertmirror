import ReferralModel from "./model.js";

// Creates a new referral record
export const createReferral = async (referrerId: string, newUserId: string) => {
	return await ReferralModel.create({
		referrerId,
		referredUserId: newUserId,
	});
};

// Fetches all referrals made by a specific user
export const getUserReferrals = async (
	userId: string,
	page: number,
	limit: number,
) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;

	const [referrals, totalDocuments] = await Promise.all([
		ReferralModel.find({ referrerId: userId })
			.populate("referredUserId", "username fullName profilePicture createdAt")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		ReferralModel.countDocuments({ referrerId: userId }),
	]);

	return {
		data: referrals,
		pagination: {
			total: totalDocuments,
			page,
			limit,
			totalPages: Math.ceil(totalDocuments / limit),
		},
	};
};

// Admin Service

// Update Referral Details
export const updateReferralStatus = async (
	referralId: string,
	rewardAmount: number = 0,
) => {
	const updatedReferral = await ReferralModel.findByIdAndUpdate(
		referralId,
		{ rewardAmount },
		{ new: true, runValidators: true },
	);

	if (!updatedReferral) throw new Error("Referral not found");
	return updatedReferral;
};

// READ ALL: Fetches a paginated list of all Referrals
export const getPaginatedUsers = async (page: number, limit: number) => {
	const skip = (page === 0 ? 0 : page - 1) * limit;

	const [users, totalDocuments] = await Promise.all([
		ReferralModel.find()
			.populate("referrerId")
			.populate("referredUserId")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		ReferralModel.countDocuments(),
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
