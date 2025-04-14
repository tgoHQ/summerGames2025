import { env } from "./env.js";
import { container } from "@sapphire/framework";
import { Channel, ChannelType, ForumChannel, GuildForumTag } from "discord.js";

async function fetchChannel<T extends ChannelType>(
	id: string,
	type: T
): Promise<Channel & { type: T }> {
	const channel = await container.client.channels.fetch(id);
	if (!channel) throw new Error(`Channel ${id} not found`);
	if (channel.type !== type)
		throw new Error(`Channel ${id} is not of type ${type}`);
	return channel as Channel & { type: T };
}

async function fetchForumTag(
	id: string,
	channel: ForumChannel
): Promise<GuildForumTag> {
	const tag = channel.availableTags.find(
		(tag) => tag.id === id
	);

	if (!tag) throw new Error("Photo of the week tag not found");

	return tag;
}

export const CHANNEL_PLEDGES = () =>
	fetchChannel(env.CHANNEL_PLEDGES_ID, ChannelType.GuildText);

export const CHANNEL_TOTALS = () =>
	fetchChannel(env.CHANNEL_TOTALS_ID, ChannelType.GuildText);

export const CHANNEL_CLAIMS = () =>
	fetchChannel(env.CHANNEL_CLAIMS_ID, ChannelType.GuildForum);

export const TAG_PENDING = async () =>
	fetchForumTag(env.TAG_PENDING_ID, await CHANNEL_CLAIMS());

export const TAG_APPROVED = async () =>
	fetchForumTag(env.TAG_APPROVED_ID, await CHANNEL_CLAIMS());