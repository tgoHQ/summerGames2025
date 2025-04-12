import { TextChannel } from "discord.js";

import { updatePledgeBoard } from "../pledges/index.js";
import { updateTotalsBoard } from "./totals.js";

export async function replaceChannelContent(
	channel: TextChannel,
	content: string[]
) {
	const oldMessages = await channel.messages.fetch();

	oldMessages.forEach(async (message) => {
		await message.delete();
	});

	for (const string of content) {
		const message = await channel.send({
			content: string,
			allowedMentions: {},
		});
		message.suppressEmbeds();
	}
}

export async function updateAllBoards() {
	await Promise.all([updateTotalsBoard(), updatePledgeBoard()]);
}

