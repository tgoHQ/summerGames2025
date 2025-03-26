import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { updateAllBoards } from "../logic/leaderboard/index.js";

export class UpdateAllBoardsCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("updateboards")
				.setDescription("manually update all info boards");
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		
		await interaction.deferReply();		
		
		const [, error] = await tryCatch(
			updateAllBoards()
		);

		if (error) {
			await interaction.editReply(`Error: ${error.message}`);
			return;
		}

		await interaction.editReply(
			"All info boards updated."
		);
	}
}
