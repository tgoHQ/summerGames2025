import { db } from "../../db/index.js";
import { competitors } from "../../db/schema.js";
import { maxCompetitorsPerTeam } from "../../config.js";
import { replaceChannelContent } from "../leaderboard/index.js";
import { CHANNEL_COMPETITORS } from "../../util/loadDiscordObjects.js";
import { renderPointsBreakdownByType } from "../points/points.js";

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

async function generateCompetitorsBoard() {
	const competitors = await db.query.competitors.findMany({
		with: {
			team: true,
			points: true,
		},
	});

	const competitorStrings: string[] = [];

	for (const competitor of competitors) {
		const competitorPoints = competitor.points.reduce(
			(acc, point) => acc + point.value,
			0
		);

		competitorStrings.push(
			`
			## <@${competitor.id}> - ${competitorPoints} points
			### ${competitor.team.name}
						
			${renderPointsBreakdownByType(competitor.points)}
			`.replaceAll("	", "")
		);
	}

	return `
	# Individuals Leaderboard

	${competitorStrings.join("\n")}
	`.replaceAll("	", "");
}

export async function updateCompetitorsBoard() {
	const content = await generateCompetitorsBoard();
	await replaceChannelContent(await CHANNEL_COMPETITORS(), [content]);
}
