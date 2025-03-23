import { db } from "../../db/index.js";
import { pledges } from "../../db/schema.js";

export async function createPledge(opts: CreatePledgeOpts) {
	//create points in db
	return (await db.insert(pledges).values(opts).returning())[0];

}
type CreatePledgeOpts = {
	/** Discord user ID */
	id: string;
	/** The amount of the pledge in USD */
	value: number;
};