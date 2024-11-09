const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization;

		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthenticated" });
		}
		const userRecord = jwt.verify(token, process.env.SECRET_KEY);

		if (userRecord) {
			req.user = userRecord;
			next();
		} else {
			res.status(401).json({
				success: false,
				message: "Unauthorized user",
			});
		}
	} catch (error) {
		console.log("Middle-ware-ERROR-->>", error);
		res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};
