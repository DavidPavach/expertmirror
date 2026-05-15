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

// UPDATE: Modifies the global application settings.
export const updateGlobalSettings = async (updateData: UpdateSettingsInput) => {
	const settings = await SettingsModel.findOneAndUpdate(
		{ isGlobal: true },
		{ $set: updateData },
		{ returnDocument: "after", upsert: true, runValidators: true },
	);

	return settings;
};
