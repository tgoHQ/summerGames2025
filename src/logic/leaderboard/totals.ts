import { getAllPoints } from "../points/points.js";
import { replaceChannelContent } from "./index.js";
import { CHANNEL_TOTALS } from "../../util/loadDiscordObjects.js";
import { pointTypes } from "../points/pointTypes.js";
import { miToKm } from "../../util/convertUnits.js";

async function generateTotalsBoard() {
	const points = await getAllPoints();

	const totalPoints = points.reduce((acc, point) => acc + point.value, 0);

	const typeStrings: string[] = [];

	for (const pointType of pointTypes) {
		const thisTypePoints = points.filter(
			(point) => point.type === pointType.id
		);

		const typeTotalPoints = thisTypePoints.reduce(
			(acc, point) => acc + point.value,
			0
		);
		const miles = typeTotalPoints / pointType.pointRatio;
		const kilometers = miToKm(miles);

		typeStrings.push(
			`## ${pointType.name}
			- ${typeTotalPoints} points (${Math.round(
				(100 * typeTotalPoints) / totalPoints
			)}% of total)
			- ${miles.toFixed(1)} miles / ${kilometers.toFixed(1)} kilometers`
		);
	}

	return `
	# Server-Wide Totals
	Total points: **${Math.round(totalPoints)}**

	${typeStrings.join("\n")}
	`.replaceAll("	", "");
}

export async function updateTotalsBoard() {
	const content = await generateTotalsBoard();
	await replaceChannelContent(await CHANNEL_TOTALS(), [content]);
}
