// For the Response
// biome-ignore lint/suspicious/noExplicitAny: false positive
declare type ApiResponse<T = any> = {
	status: number;
	success: boolean;
	message: string;
	data?: T;
};

// Location Info
declare type LocationInfo = {
	city: string;
	region: string;
	country: string;
	timezone: string;
};

// IP Result Response
declare type IpWhoIsResponse = {
	success: boolean;
	city?: string;
	region?: string;
	country?: string;
	timezone?: { id?: string };
};

// Withdrawal Email Props
type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

declare type WithdrawalEmailParams = {
	name: string;
	coin: string;
	amount: string;
	walletAddress: string;
	date: string;
	status: TransactionStatus;
};

// Deposit Email Props
declare type DepositEmailParams = {
	name: string;
	coin: string;
	amount: string;
	date: string;
	status: TransactionStatus;
};
