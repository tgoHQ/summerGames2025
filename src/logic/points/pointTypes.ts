export const pointTypes: PointType[] = [
	{
		name: "Hiking, Running",
		pastTense: "hiked",
		id: "hiking",
		pointsPerMile: 1,
	},
	{
		name: "Cycling",
		pastTense: "cycled",
		id: "cycling",
		pointsPerMile: 0.2,
	},
	{
		name: "Swimming",
		pastTense: "swam",
		id: "swimming",
		pointsPerMile: 5,
	},
	{
		name: "Paddling",
		pastTense: "paddled",
		id: "paddling",
		pointsPerMile: 1,
	},
];

type PointType = {
	name: string;
	pastTense: string;
	id: PointTypeId;
	pointsPerMile: number;
};

import { activityTypeEnum } from "../../db/schema";

export type PointTypeId = (typeof activityTypeEnum.enumValues)[number]; // "admin" | "user" | "guest"
