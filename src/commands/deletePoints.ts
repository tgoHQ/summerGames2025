import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { deletePoints, getPoints } from "../logic/points/points.js";

export class DeletePointsCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("deletepoints")
				.setDescription("delete a point record")
				.addIntegerOption((option) =>
					option
						.setName("id")
						.setDescription("id of the point record to delete")
						.setRequired(true)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {

		const [points, getError] = await tryCatch(
			getPoints(interaction.options.getInteger("id", true))
		);

		if (getError) {
			await interaction.reply(`Error: ${getError.message}`);
			return;
		}

		if (!points) {
			await interaction.reply(`Point record with ID \`${interaction.options.getInteger("id", true)}\` not found.`);
			return;
		}

		const [, deleteError] = await tryCatch(
			deletePoints(interaction.options.getInteger("id", true))
		);

		if (deleteError) {
			await interaction.reply(`Error: ${deleteError.message}`);
			return;
		}

		await interaction.reply(
			`Point record with ID \`${points.id}\` deleted. It was for <@${points.competitorId}> on ${points.date}, worth ${points.value} points.`
		);
	}
}
