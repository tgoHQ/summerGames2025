import { db } from "../../db/index.js";
import { teams, competitors } from "../../db/schema.js";
import { maxCompetitorsPerTeam } from "../../config.js";

export async function createTeam(opts: CreateTeamOpts) {
	return (await db.insert(teams).values(opts).returning())[0];
}
type CreateTeamOpts = {
	name: string;
};

export async function addCompetitor(opts: AddCompetitorOpts) {
	//todo check if the team already has max number of competitors

	const competitorsInTeam = await db.query.competitors.findMany({
		where: (competitors, { eq }) => eq(competitors.teamId, opts.teamId),
	});

	if (competitorsInTeam.length >= maxCompetitorsPerTeam) {
		throw new Error(`Team already has max number of competitors (${maxCompetitorsPerTeam})`);
	}
	
	return (await db.insert(competitors).values(opts).returning())[0];
}
type AddCompetitorOpts = {
	id: string;
	teamId: number;
};
