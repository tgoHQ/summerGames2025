import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { addCompetitor } from "../logic/manageTeams/manageTeams.js";

export class AddCompetitorCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("addcompetitor")
				.setDescription("add a competitor to a team")
				.addIntegerOption((option) =>
					option
						.setName("team")
						.setDescription("id of the team")
						.setRequired(true)
				)
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("user to add to the team")
						.setRequired(true)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		const targetUser = interaction.options.getUser("user", true);

		const [competitor, error] = await tryCatch(
			addCompetitor({
				id: targetUser.id,
				teamId: interaction.options.getInteger("team", true),
			})
		);

		if (error) {
			await interaction.reply(`Error: ${error.message}`);
			return;
		}

		await interaction.reply(
			`Competitor ${targetUser} added to team with ID \`${competitor.teamId}\`.`
		);
	}
}
