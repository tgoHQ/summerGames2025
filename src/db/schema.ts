import {
	integer,
	pgTable,
	text,
	decimal,
	serial,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const teams = pgTable("teams", {
	id: serial().primaryKey(),
	name: text().notNull().unique(),
	beneficiaryName: text("beneficiary_name").notNull(),
	beneficiaryLink: text("beneficiary_link").notNull(),
	beneficiaryBlurb: text("beneficiary_blurb").notNull(),
});
export const teamRelations = relations(teams, ({ many }) => ({
	competitors: many(competitors),
}));

export const competitors = pgTable("competitors", {
	id: text().primaryKey(),
	teamId: integer("team_id")
		.references(() => teams.id)
		.notNull(),
});
export const competitorRelations = relations(competitors, ({ one, many }) => ({
	team: one(teams, {
		fields: [competitors.teamId],
		references: [teams.id],
	}),
	points: many(points),
}));

export const activityTypeEnum = pgEnum("activityType", [
	"hiking",
	"cycling",
	"swimming",
	"paddling",
]);

export const points = pgTable("points", {
	id: serial().primaryKey(),
	competitorId: text("competitor_id")
		.references(() => competitors.id)
		.notNull(),
	value: decimal({ mode: "number" }).notNull(),
	date: timestamp({ mode: "date" }).notNull(),
	type: activityTypeEnum().notNull(),
	//todo link to message or thread with proof
});

export const pointsRelations = relations(points, ({ one }) => ({
	competitor: one(competitors, {
		fields: [points.competitorId],
		references: [competitors.id],
	}),
}));

export const pledges = pgTable("pledges", {
	id: text().primaryKey(),
	value: decimal({mode: "number"}).notNull(),
});
