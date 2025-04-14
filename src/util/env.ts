import "dotenv/config";

import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
	TOKEN: str(),
	GUILD_ID: str(),
	DATABASE_URL: str(),

	CHANNEL_PLEDGES_ID: str(),
	CHANNEL_TOTALS_ID: str(),
	CHANNEL_CLAIMS_ID: str(),
	
	TAG_PENDING_ID: str(),
	TAG_APPROVED_ID: str(),
});
