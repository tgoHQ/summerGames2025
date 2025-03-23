import { db } from "../../db/index.js";
import { pledges } from "../../db/schema.js";
import { replaceChannelContent } from "../leaderboard/index.js";
import { CHANNEL_PLEDGES } from "../../util/loadDiscordObjects.js";

export async function createPledge(opts: CreatePledgeOpts) {
	//create points in db
	const pledge = (await db.insert(pledges).values(opts).returning())[0];

	await updatePledgeBoard();
	return pledge;
}
type CreatePledgeOpts = {
	/** Discord user ID */
	id: string;
	/** The amount of the pledge in USD */
	value: number;
};

async function getAllPledges() {
	return db.query.pledges.findMany({
		orderBy: (pledge, { desc }) => [desc(pledge.value)],
	});
}

export async function generatePledgeBoard() {
	const pledges = await getAllPledges();

	return `
	# Pledges - Total $${pledges.reduce((acc, pledge) => acc + pledge.value, 0)} USD.

	These are the donation pledges that have been made. At the end of the games, all the money will go to the winning team's nonprofit.

	${pledges.map((pledge) => `- $${pledge.value} from <@${pledge.id}>`).join("\n")}

	Open a ticket with </tickets open:839848848003825673> to make a pledge yourself!
	`.replaceAll("	", "");
}

export async function updatePledgeBoard() {
	const content = await generatePledgeBoard();
	await replaceChannelContent(await CHANNEL_PLEDGES(), content);
}
