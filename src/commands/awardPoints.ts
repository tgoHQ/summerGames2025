import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { createPoints } from "../logic/points/points.js";
import { pointTypes } from "../logic/points/pointTypes.js";
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
				.addStringOption((option) =>
					option
						.setName("type")
						.setDescription("the type of activity")
						.addChoices(
							...pointTypes.map((type) => ({ name: type.id, value: type.id }))
						)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("distance")
						.setDescription("distance of this activity")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("unit")
						.addChoices(
							{ name: "miles", value: "miles" },
							{ name: "kilometers", value: "kilometers" }
						)
						.setDescription("the distance unit")
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
		const distance = interaction.options.getInteger("distance", true);
		const unit = interaction.options.getString("unit", true);

		const miles = unit === "kilometers" ? kmToMi(distance) : distance;

		const pointType = pointTypes.find(
			(type) => type.id === interaction.options.getString("type", true)
		);

		if (!pointType) {
			throw new Error(`Invalid point type`);
		}

		const pointValue = pointType.pointsPerMile * miles;

		const [points, error] = await tryCatch(
			createPoints({
				competitorId: targetUser.id,
				//todo
				date: new Date(),
				value: pointValue,
			})
		);

		if (error) {
			await interaction.reply(`Error: ${error.message}`);
			return;
		}

		await interaction.reply(
			`Awarded ${pointValue} points to ${targetUser} for ${distance} ${unit} of ${pointType.name}. ID \`${points.id}\`.`
		);
	}
}
