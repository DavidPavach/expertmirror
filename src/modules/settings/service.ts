import { AppError } from "../../utils/error.js";
import SettingsModel from "./model.js";
import type { UpdateSettingsInput } from "./schema.js";

// READ: Fetches the global application settings.
export const getGlobalSettings = async () => {
	let settings = await SettingsModel.findOne({ isGlobal: true });

	if (!settings) {
		settings = await SettingsModel.create({ isGlobal: true });
	}

	return settings;
};

export const updateGlobalSettings = async (updateData: UpdateSettingsInput) => {
	const { depositCoins, withdrawalCoins, ...primitiveSettings } = updateData;

	// biome-ignore lint/suspicious/noExplicitAny: false positive
	const updateQuery: any = {};

	// Apply standard fields (like threshold) to $set
	if (Object.keys(primitiveSettings).length > 0) {
		updateQuery.$set = primitiveSettings;
	}

	// biome-ignore lint/suspicious/noExplicitAny: false positive
	const pushQuery: any = {};
	if (depositCoins && depositCoins.length > 0) {
		pushQuery.depositCoins = { $each: depositCoins };
	}
	if (withdrawalCoins && withdrawalCoins.length > 0) {
		pushQuery.withdrawalCoins = { $each: withdrawalCoins };
	}
	if (Object.keys(pushQuery).length > 0) {
		updateQuery.$push = pushQuery;
	}

	// Execute the update
	const settings = await SettingsModel.findOneAndUpdate(
		{ isGlobal: true },
		updateQuery,
		{ new: true, upsert: true, runValidators: true },
	);

	return settings;
};

// DELETE: Removes a specific coin from the depositCoins array
export const removeDepositCoin = async (coinId: string) => {
	const updatedSettings = await SettingsModel.findOneAndUpdate(
		{ isGlobal: true },
		{ $pull: { depositCoins: { _id: coinId } } },
		{ returnDocument: "after" },
	);

	if (!updatedSettings) {
		throw new AppError("Settings document not found.", { statusCode: 404 });
	}

	return updatedSettings;
};

// DELETE: Removes a specific coin from the withdrawalCoins array
export const removeWithdrawalCoin = async (coinId: string) => {
	const updatedSettings = await SettingsModel.findOneAndUpdate(
		{ isGlobal: true },
		{ $pull: { withdrawalCoins: { _id: coinId } } },
		{ returnDocument: "after" },
	);

	if (!updatedSettings) {
		throw new AppError("Settings document not found.", { statusCode: 404 });
	}

	return updatedSettings;
};
