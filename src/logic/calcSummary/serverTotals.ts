import { db } from "../../db/index.js";

export async function calcServerTotals() {
	const points = await db.query.points.findMany();

	console.log(points);
}

calcServerTotals();
