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

// import { replaceChannelContent } from "../leaderboard/index.js";
// import { CHANNEL_COMPETITORS } from "../../util/loadDiscordObjects.js";
// import { renderPointsBreakdownByType } from "../points/points.js";
// async function generateCompetitorsBoard() {
// 	const competitors = await db.query.competitors.findMany({
// 		with: {
// 			team: true,
// 			points: true,
// 		},
// 	});

// 	const competitorStrings: string[] = [];

// 	for (const competitor of competitors) {
// 		const competitorPoints = competitor.points.reduce(
// 			(acc, point) => acc + point.value,
// 			0
// 		);

// 		competitorStrings.push(
// 			`
// 			.
// 			## <@${competitor.id}> - ${competitorPoints.toFixed(2)} points
// 			### ${competitor.team.name}
						
// 			${renderPointsBreakdownByType(competitor.points)}
// 			`.replaceAll("	", "")
// 		);
// 	}

// 	return ["# Individuals Leaderboard", ...competitorStrings];
// }

// function sliceReducer<T>(data: T[], chunkSize: number) {
// 	return (
// 		data.reduce((result, _, i) => {
// 			const slice = data.slice(chunkSize * i, chunkSize * (i + 1));
// 			if (slice.length) result.push(slice);
// 			return result;
// 		}, []),
		
// 	);
// }

// const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// const chunked = input.reduce(sliceReducer(input, 5), []);

// export async function updateCompetitorsBoard() {
// 	const content = await generateCompetitorsBoard();
// 	await replaceChannelContent(await CHANNEL_COMPETITORS(), content);
// }
