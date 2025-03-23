import { TextChannel } from "discord.js";

export async function replaceChannelContent(
	channel: TextChannel,
	content: string
) {
	const oldMessages = await channel.messages.fetch();

	oldMessages.forEach(async (message) => {
		await message.delete();
	});

	await channel.send({ content, allowedMentions: { users: [] } });
}
