import { Events, Listener } from "@sapphire/framework";
import { ThreadChannel } from "discord.js";
import { CHANNEL_CLAIMS, TAG_PENDING } from "../util/loadDiscordObjects.js";

export class ClaimsAutoTagListener extends Listener {
	public constructor(
		context: Listener.LoaderContext,
		options: Listener.Options
	) {
		super(context, {
			...options,
			event: Events.ThreadCreate,
		});
	}

	public async run(thread: ThreadChannel) {
		if (thread.parent !== (await CHANNEL_CLAIMS())) return; //if thread not from claims channel, return

		await thread.setAppliedTags([(await TAG_PENDING()).id]);
	}
}
