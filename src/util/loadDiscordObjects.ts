import { env } from "./env.js";
import { container } from "@sapphire/framework";
import { Channel, ChannelType } from "discord.js";

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

export const CHANNEL_PLEDGES = () =>
	fetchChannel(env.CHANNEL_PLEDGES_ID, ChannelType.GuildText);

export const CHANNEL_TOTALS = () =>
	fetchChannel(env.CHANNEL_TOTALS_ID, ChannelType.GuildText);

export const CHANNEL_TEAMS = () =>
	fetchChannel(env.CHANNEL_TEAMS_ID, ChannelType.GuildText);

export const CHANNEL_COMPETITORS = () =>
	fetchChannel(env.CHANNEL_COMPETITORS_ID, ChannelType.GuildText);
