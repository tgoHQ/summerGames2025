import "dotenv/config";

import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
	TOKEN: str(),
	GUILD_ID: str(),
	DATABASE_URL: str(),

	CHANNEL_PLEDGES_ID: str(),
	CHANNEL_TOTALS_ID: str(),
	// CHANNEL_TEAMS_ID: str(),
	// CHANNEL_COMPETITORS_ID: str(),
});
