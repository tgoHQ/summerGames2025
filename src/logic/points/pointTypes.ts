export const pointTypes: PointType[] = [
	{
		name: "Hiking, Running",
		pastTense: "hiked",
		id: "hiking",
		pointRatio: 1,
	},
	{
		name: "Cycling",
		pastTense: "cycled",
		id: "cycling",
		pointRatio: 0.2,
	},
	{
		name: "Swimming",
		pastTense: "swam",
		id: "swimming",
		pointRatio: 5,
	},
	{
		name: "Paddling",
		pastTense: "paddled",
		id: "paddling",
		pointRatio: 1,
	},
];

type PointType = {
	name: string;
	pastTense: string;
	id: PointTypeId;
	pointRatio: number;
	// toValue: (any: any) => number;
	// toStatString: (value: number) => string;
};

import { activityTypeEnum } from "../../db/schema";

export type PointTypeId = (typeof activityTypeEnum.enumValues)[number];
