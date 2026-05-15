import axios from "axios";
import type { FastifyReply, FastifyRequest } from "fastify";
import { COINGECKO_API_KEY } from "../../config.js";
import { coinIds } from "../../utils/format.js";
import { sendResponse } from "../../utils/response.utils.js";

// Constants
const cache = new Map();
const CACHE_KEY = "prices";
const CACHE_TTL = 2 * 60 * 1000;
const coingeckoURL = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

// Fetch Prices Handler
export const FetchPricesHandler = async (
	_: FastifyRequest,
	reply: FastifyReply,
) => {
	const now = Date.now();
	const cached = cache.get(CACHE_KEY);

	if (cached && now - cached.timestamp < CACHE_TTL) {
		return sendResponse(
			reply,
			200,
			true,
			"Coins prices were fetched successfully (from cache)",
			cached.data,
		);
	}

	try {
		const { data } = await axios.get(coingeckoURL, {
			headers: {
				Accept: "application/json",
				"x-cg-demo-api-key": COINGECKO_API_KEY,
			},
		});

		// Cache data and return
		cache.set(CACHE_KEY, { data, timestamp: now });
		return sendResponse(
			reply,
			200,
			true,
			"Coins prices were fetched successfully",
			data,
		);
	} catch (error) {
		console.log("Failed to fetch prices:", error);
		return sendResponse(
			reply,
			500,
			false,
			"Failed to fetch coin prices. Please try again later.",
		);
	}
};
