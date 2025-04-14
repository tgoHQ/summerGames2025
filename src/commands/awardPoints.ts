import { Command } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";
import { createPoints } from "../logic/points/points.js";
import { pointTypes } from "../logic/points/pointTypes.js";
import { kmToMi } from "../util/convertUnits.js";
import { ChannelType } from "discord.js";
import { env } from "../util/env.js";
import { TAG_APPROVED } from "../util/loadDiscordObjects.js";

export class AwardPointsCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("points")
				.setDescription("award points to a competitor")
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
				.addStringOption((option) =>
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
				.addIntegerOption((option) =>
					option
						.setName("dateoffset")
						.setDescription("date offset. if it happened 48 hours ago, put -2")
						.setRequired(false)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		await interaction.deferReply();

		//check where the command was run
		if (
			!interaction.channel ||
			interaction.channel.type !== ChannelType.PublicThread ||
			interaction.channel.parent?.id !== env.CHANNEL_CLAIMS_ID
		) {
			await interaction.editReply(
				`This command must be calleed from a thread in the claims channel.`
			);
			return;
		}

		const targetUser = interaction.options.getUser("user", true);
		const distanceString = interaction.options.getString("distance", true);
		const unit = interaction.options.getString("unit", true);

		const distance = parseFloat(distanceString);

		if (isNaN(distance)) {
			await interaction.editReply(`Invalid distance: ${distanceString}`);
			return;
		}

		const miles = unit === "kilometers" ? kmToMi(distance) : distance;

		const pointType = pointTypes.find(
			(type) => type.id === interaction.options.getString("type", true)
		);

		if (!pointType) {
			throw new Error(`Invalid point type`);
		}

		const pointValue = pointType.pointRatio * miles;

		const dateoffset = interaction.options.getInteger("dateoffset");

		const date = dateoffset
			? new Date(Date.now() + dateoffset * 24 * 60 * 60 * 1000)
			: new Date();

		const [points, error] = await tryCatch(
			createPoints({
				competitorId: targetUser.id,
				date,
				value: pointValue,
				type: pointType.id,
			})
		);

		if (error) {
			await interaction.editReply(`Error: ${error.message}`);
			return;
		}

		await interaction.channel.setAppliedTags([(await TAG_APPROVED()).id]);
		await interaction.channel.setArchived(true);

		await interaction.editReply(
			`Awarded ${pointValue} points to ${targetUser} for ${distance} ${unit} of ${pointType.name}. Date \`${date}\`. ID \`${points.id}\`.`
		);
	}
}
