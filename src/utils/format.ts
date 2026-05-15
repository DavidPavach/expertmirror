// Format date with timezone
export const formatWithTimezone = (tz: string): string => {
	const timezone = tz || "UTC";
	const now = new Date();

	const timeOpts: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZone: timezone,
	};
	const dateOpts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "2-digit",
		timeZone: timezone,
	};

	const formattedTime = new Intl.DateTimeFormat("en-GB", timeOpts)
		.format(now)
		.toLowerCase();
	const formattedDate = new Intl.DateTimeFormat("en-GB", dateOpts).format(now);

	// Extract short TZ label from IANA (use last segment or "UTC" if given)
	const tzLabel =
		timezone === "UTC"
			? "UTC"
			: (timezone.split("/").pop()?.replace("_", " ") ?? timezone);

	return `${formattedTime} ${formattedDate} ${tzLabel}`;
};

// UTC Timezone
export function formatNowUtc(): string {
	const d = new Date();

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const year = d.getUTCFullYear();
	const monthName = months[d.getUTCMonth()];
	const day = d.getUTCDate();

	let hours = d.getUTCHours(); // 0-23
	const minutes = d.getUTCMinutes();

	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	if (hours === 0) hours = 12;

	const minutesPadded = minutes.toString().padStart(2, "0");

	return `${monthName} ${day} ${year}, ${hours}:${minutesPadded}${ampm} UTC`;
}

export const coinIds = [
	"bitcoin",
	"ethereum",
	"binancecoin",
	"tron",
	"tether",
	"solana",
	"litecoin",
	"dogecoin",
];
