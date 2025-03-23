import { db } from "../../db/index.js";
import { points } from "../../db/schema.js";
import { eq } from "drizzle-orm/expressions";

export async function createPoints(opts: CreatePointsOpts) {
	// todo check to make sure the user hasn't hit their cap. do this in a separate function

	//create points in db
	return (await db.insert(points).values(opts).returning())[0];
}
type CreatePointsOpts = {
	competitorId: string;
	date: Date;
	value: number;
};

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