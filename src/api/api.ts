//express server

import express from "express";
import { container } from "@sapphire/framework";
import { tryCatch } from "../util/tryCatch.js";

const app = express();

app.get("/api/user", async (req, res) => {
	if (!req.query["id"]) {
		res.status(400).send("Missing id query param");
		return;
	}

	const id = req.query["id"].toString();

	const [user, error] = await tryCatch(container.client.users.fetch(id));

	if (error) {
		res.status(500).send(error.message);
		return;
	}

	res.send(user);
});

app.listen(3000, () => {
	console.log("API server listening on port 3000");
});