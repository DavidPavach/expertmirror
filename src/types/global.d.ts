// For the Response
// biome-ignore lint/suspicious/noExplicitAny: false positive
declare type ApiResponse<T = any> = {
	status: number;
	success: boolean;
	message: string;
	data?: T;
};

// IPInfo
declare type IPInfo = {
	ip?: string;
	city?: string;
	region?: string;
	country_name?: string;
	timezone?: string;
	error?: boolean | string;
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
