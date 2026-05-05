// For the Response
// biome-ignore lint/suspicious/noExplicitAny: false positive
declare type ApiResponse<T = any> = {
	status: number;
	success: boolean;
	message: string;
	data?: T;
};