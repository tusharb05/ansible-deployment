const express = require("express");
const ip = require("ip");

const app = express();

app.get("/", (req, res) => {
	res.json({
		msg: `i am healthy - ${process.env.SERVER_NAME || "no-name"}`,
		ip: ip.address(),
	});
});

app.listen(3000, () => {
	console.log(
		`server (${process.env.SERVER_NAME}) running on ip: `,
		ip.address()
	);
});
