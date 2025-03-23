import {
	integer,
	pgTable,
	text,
	decimal,
	serial,
	timestamp,
} from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
	id: serial().primaryKey(),
	name: text().notNull().unique(),
	//todo beneficiary name
	//todo beneficiary link
	//todo beneficiary blurb
});

export const competitors = pgTable("competitors", {
	id: text().primaryKey(),
	teamId: integer("team_id")
		.references(() => teams.id)
		.notNull(),
});

export const points = pgTable("points", {
	id: serial().primaryKey(),
	competitorId: text("competitor_id")
		.references(() => competitors.id)
		.notNull(),
	value: decimal({ mode: "number" }).notNull(),
	date: timestamp({ mode: "date" }).notNull(),
	//todo type
	//todo link to message or thread with proof
});

export const pledges = pgTable("pledges", {
	id: text().primaryKey(),
	value: integer().notNull(),
});
