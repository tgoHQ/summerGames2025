import { db } from "../../db/index.js";
import { points } from "../../db/schema.js";
import { eq } from "drizzle-orm/expressions";
import type { PointTypeId } from "./pointTypes.js";
import { updateAllBoards } from "../leaderboard/index.js";
import { maxPointsPerWeek } from "../../config.js";

export async function createPoints(opts: CreatePointsOpts) {
	// todo check to make sure the user hasn't hit their cap. do this in a separate function

	const capCheck = await checkCap(opts);

	if (!capCheck.valid) {
		throw new Error(
			`Cannot create points because this would exceed the weekly point cap by ${capCheck.surplus}`
		);
	}

	//create points in db
	const point = (await db.insert(points).values(opts).returning())[0];

	await updateAllBoards();

	return point;
}
type CreatePointsOpts = {
	competitorId: string;
	date: Date;
	value: number;
	type: PointTypeId;
};

async function checkCap(opts: CreatePointsOpts) {
	const points = await db.query.points.findMany({
		//todo filter by date here too
		where: (points, { eq, and }) =>
			and(
				eq(points.competitorId, opts.competitorId),
				eq(points.type, opts.type)
			),
	});

	points.filter((point) => point.date);

	const thisTypeTotalPoints = points.reduce(
		(acc, point) => acc + point.value,
		0
	);

	if (thisTypeTotalPoints + opts.value > maxPointsPerWeek) {
		return {
			valid: false,
			surplus: thisTypeTotalPoints + opts.value - maxPointsPerWeek,
		};
	}

	return { valid: true };
}

export async function deletePoints(id: number) {
	await db.delete(points).where(eq(points.id, id));
}

export async function getPoints(id: number) {
	return db.query.points.findFirst({
		where: (points, { eq }) => eq(points.id, id),
	});
}

export async function getAllPoints() {
	return db.query.points.findMany();
}