import "dotenv/config";

import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
	TOKEN: str(),
	GUILD_ID: str(),
	DATABASE_URL: str(),
});
