import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { createPledge } from "../logic/pledges/index.js";

export class CreatePledgeCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("pledge")
				.setDescription("record a donation pledge")
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("the user making the donation")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setDescription("value of the donation in USD")
						.setRequired(true)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		await interaction.deferReply();
		
		const targetUser = interaction.options.getUser("user", true);
		const value = interaction.options.getInteger("amount", true);

		const [pledge, error] = await tryCatch(
			createPledge({
				id: targetUser.id,
				value,
			})
		);

		if (error) {
			await interaction.editReply(`Error: ${error.message}`);
			return;
		}

		await interaction.editReply(
			`Recorded a pledge of $${pledge.value} by ${targetUser}`
		);
	}
}
