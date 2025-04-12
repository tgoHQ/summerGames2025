import { db } from "../../db/index.js";
import { teams } from "../../db/schema.js";

export async function createTeam(opts: CreateTeamOpts) {
	return (await db.insert(teams).values(opts).returning())[0];
}
type CreateTeamOpts = {
	name: string;
	beneficiaryName: string;
	beneficiaryLink: string;
	beneficiaryBlurb: string;
};