export const pointTypes: PointType[] = [
	{
		name: "hiking / running / walking",
		pastTense: "hiked",
		id: "hiking",
		pointsPerMile: 1,
	},
	{
		name: "cycling",
		pastTense: "cycled",
		id: "cycling",
		pointsPerMile: 0.2,
	},
	{
		name: "swimming",
		pastTense: "swam",
		id: "swimming",
		pointsPerMile: 5,
	},
	{
		name: "paddling",
		pastTense: "paddled",
		id: "paddling",
		pointsPerMile: 1,
	},
];

type PointType = {
	name: string;
	pastTense: string;
	id: string;
	pointsPerMile: number;
};
