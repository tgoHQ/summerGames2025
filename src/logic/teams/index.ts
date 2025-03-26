import { db } from "../../db/index.js";
import { teams } from "../../db/schema.js";
import { replaceChannelContent } from "../leaderboard/index.js";
import { CHANNEL_TEAMS } from "../../util/loadDiscordObjects.js";
import { renderPointsBreakdownByType } from "../points/points.js";

export async function createTeam(opts: CreateTeamOpts) {
	return (await db.insert(teams).values(opts).returning())[0];
}
type CreateTeamOpts = {
	name: string;
	beneficiaryName: string;
	beneficiaryLink: string;
	beneficiaryBlurb: string;
};

async function generateTeamsBoard() {
	//todo fill in the content of this

	const teams = await db.query.teams.findMany({
		with: {
			competitors: {
				with: {
					points: true,
				},
			},
		},
	});

	const teamStrings: string[] = [];

	for (const team of teams) {
		//put all the points in a single array
		const points = team.competitors.flatMap((competitor) => competitor.points);

		const totalPoints = points.reduce((acc, point) => acc + point.value, 0);

		const pointsBreakdown = renderPointsBreakdownByType(points);

		teamStrings.push(
			`
			## ${team.name} - ${Math.round(totalPoints)} points
			${team.competitors.map((competitor) => `<@${competitor.id}>`).join(", ")}
			**Supporting [${team.beneficiaryName}](${team.beneficiaryLink})**
			${team.beneficiaryBlurb}
			${pointsBreakdown}
			`.replaceAll("	", "")
		);
	}

	return `
	# Teams Leaderboard

	${teamStrings.join("\n")}
	`.replaceAll("	", "");
}

export async function updateTeamsBoard() {
	const content = await generateTeamsBoard();
	await replaceChannelContent(await CHANNEL_TEAMS(), [content]);
}
