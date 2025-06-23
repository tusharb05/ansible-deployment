const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.json({
		msg: `i am healthy - ${process.env.SERVER_NAME || "no-name"}`,
	});
});

app.listen(3000, () => {
	console.log(
		`server (${process.env.SERVER_NAME}) running on ip: `
	);
});
