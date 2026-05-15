import mongoose, { type Document, Schema } from "mongoose";

// TypeScript Interfaces
export interface DepositCoin {
	coinName: string;
	symbol: string;
	qrCode: string;
	walletAddress: string;
}

export interface WithdrawalCoin {
	coinName: string;
	symbol: string;
}

export interface SettingsDoc extends Document {
	isGlobal: boolean;
	depositCoins: DepositCoin[];
	threshold: number;
	whatsAppNumber: string;
	address: string;
	thresholdText: string;
	withdrawalCoins: WithdrawalCoin[];
	minDeposit: number;
	minWithdrawal: number;
	noWithdrawal: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Sub-schemas
const coinSchema = new Schema<DepositCoin>(
	{
		coinName: { type: String, required: true, lowercase: true },
		symbol: { type: String, required: true, lowercase: true },
		qrCode: { type: String, required: true },
		walletAddress: { type: String, required: true },
	},
	{ _id: true },
);

const withdrawalCoinSchema = new Schema<WithdrawalCoin>(
	{
		coinName: { type: String, required: true, lowercase: true },
		symbol: { type: String, required: true, lowercase: true },
	},
	{ _id: true },
);


// 3. Main Settings Schema
const settingsSchema = new Schema<SettingsDoc>(
	{
		isGlobal: { type: Boolean, default: true, unique: true },
		threshold: { type: Number, default: 0 },
		whatsAppNumber: { type: String, default: "00000000000" },
		address: { type: String, default: "No Address Yet" },
		thresholdText: { type: String, default: "Upgrade to PDT Level to be able to watch live trading sessions" },
		depositCoins: { type: [coinSchema], default: [] },
		withdrawalCoins: { type: [withdrawalCoinSchema], default: [] },
		minDeposit: { type: Number, default: 0 },
		minWithdrawal: { type: Number, default: 0 },
		noWithdrawal: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const SettingsModel = mongoose.model<SettingsDoc>("Settings", settingsSchema);
export default SettingsModel;
