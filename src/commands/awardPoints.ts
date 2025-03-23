import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { createPoints } from "../logic/points/points.js";
import { kmToMi } from "../util/convertUnits.js";

export class AwardPointsCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("awardpoints")
				.setDescription("award points")
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("user to award points to")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("points")
						.setDescription("number of points to award")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("unit")
						.addChoices(
							{ name: "miles", value: "miles" },
							{ name: "kilometers", value: "kilometers" }
						)
						.setDescription("the unit the points are in")
						.setRequired(true)
			)
				.addStringOption((option) =>
					option
						.setName("type")
						.setDescription("the type of points awarded")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						//todo
						.setName("date")
						.setDescription("date on which the points were earned")
						.setRequired(true)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		const targetUser = interaction.options.getUser("user", true);
		const rawPoints = interaction.options.getInteger("points", true);
		const unit = interaction.options.getString("unit", true);

		const pointsInMiles = unit === "kilometers" ? kmToMi(rawPoints) : rawPoints;

		const [points, error] = await tryCatch(
			createPoints({
				competitorId: targetUser.id,
				//todo
				date: new Date(),
				value: pointsInMiles,
			})
		);

		if (error) {
			await interaction.reply(`Error: ${error.message}`);
			return;
		}

		await interaction.reply(
			`Awarded ${rawPoints} ${unit} to ${targetUser} (points ID \`${points.id}\`)`
		);
	}
}
