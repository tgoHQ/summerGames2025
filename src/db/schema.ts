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
});

export const pledges = pgTable("pledges", {
	id: text().primaryKey(),
	value: integer().notNull(),
});
