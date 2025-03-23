import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env.js";
import * as schema from "./schema.js";

export const db = drizzle({
	connection: env.DATABASE_URL,
	casing: "snake_case",
	schema,
});
