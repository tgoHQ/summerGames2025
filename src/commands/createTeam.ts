import { Command } from "@sapphire/framework";
import { createTeam } from "../logic/teams/index.js";
import { tryCatch } from "../util/tryCatch.js";

export class CreateTeamCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("createteam")
				.setDescription("create a new team")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("name of the team")
						.setRequired(true)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		const [team, error] = await tryCatch(
			createTeam({
				name: interaction.options.getString("name", true),
			})
		);

		if (error) {
			await interaction.reply(`Error: ${error.message}`);
			return;
		}

		await interaction.reply(
			`Team \`${team.name}\` created with ID \`${team.id}\`.`
		);
	}
}
