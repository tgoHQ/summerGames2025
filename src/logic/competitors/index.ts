import { db } from "../../db/index.js";
import { competitors } from "../../db/schema.js";
import { maxCompetitorsPerTeam } from "../../config.js";


export async function createCompetitor(opts: AddCompetitorOpts) {
	// get the number of competitors already in the team
	const competitorsInTeam = await db.query.competitors.findMany({
		where: (competitors, { eq }) => eq(competitors.teamId, opts.teamId),
	});

	if (competitorsInTeam.length >= maxCompetitorsPerTeam) {
		throw new Error(
			`Team already has max number of competitors (${maxCompetitorsPerTeam})`
		);
	}

	return (await db.insert(competitors).values(opts).returning())[0];
}
type AddCompetitorOpts = {
	id: string;
	teamId: number;
};
