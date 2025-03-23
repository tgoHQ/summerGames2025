export const pointTypes: PointType[] = [
	{
		name: "hiking / running / walking",
		pastTense: "hiked",
		id: "hiking",
		multiplier: 1,
	},
	{
		name: "running",
		pastTense: "ran",
		id: "running",
		multiplier: 1,
	},
	{
		name: "cycling",
		pastTense: "cycled",
		id: "cycling",
		multiplier: 0.2,
	},
	{
		name: "swimming",
		pastTense: "swam",
		id: "swimming",
		multiplier: 1,
	},
	{
		name: "paddling",
		pastTense: "paddled",
		id: "paddling",
		multiplier: 1,
	},
];

type PointType = {
	name: string;
	pastTense: string;
	id: string;
	multiplier: number;
};
