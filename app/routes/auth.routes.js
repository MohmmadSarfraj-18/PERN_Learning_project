/**
 * @module auth
 * @description Handles routing for user-related endpoints
 * @date 31-Oct-2024
 * @author Mohammad Sarfaraz
 */

const express = require("express");
const AuthModule = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetchUser = require("../middleware/fetchUser");

module.exports = (app) => {
	const router = express.Router();

	/*--------------      New   User Registration    -------------*/
	router.post("/sign-up", async (req, res) => {
		try {
			const users = await Promise.all(
				req.body?.map(async (user) => {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
					return user;
				})
			);
			// console.log("users-records-->>", users);

			const result = await AuthModule.newUserRegister(users);

			if (result) {
				res.status(201).json({ success: true, result: result });
			} else {
				res.status(404).json({ success: false, message: "Not Found" });
			}
		} catch (error) {
			res.status(500).json({
				success: true,
				message: "Internal server error",
			});
		}
	});

	/*-------------- User login API --------------*/
	router.post("/login", async (req, res) => {
		try {
			const result = await AuthModule.findUserByUsernameAndPassword(
				req.body
			);

			if (!result) {
				return res.status(400).json({
					success: false,
					message: "Please login correct Credentials",
				});
			}

			const compare_password = await bcrypt.compare(
				req.body.password,
				result[0].password
			);

			if (compare_password) {
				delete result[0].password;
				delete result[0].username;
				const authToken = jwt.sign(result[0], process.env.SECRET_KEY, {
					expiresIn: "3h",
				});

				res.status(200).json({ success: true, token: authToken });
			} else {
				res.status(400).json({ success: false, message: "wrong password" });
			}
		} catch (error) {
			console.log("error-->>>", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	});

	/*--------------    fetch All/ById Users   -------------*/
	router.get("/:id?", fetchUser, async (req, res) => {
		try {
			const result = await AuthModule.fetchUsers(req?.params?.id);
			if (result) {
				res.status(200).json({ success: true, result: result });
			} else {
				res.status(404).json({ success: false, message: "Not Found" });
			}
		} catch (error) {
			res.status(500).json({
				success: true,
				message: "Internal server error",
			});
		}
	});

	/*--------------    Delete User By Id   -------------*/
	router.delete("/:id", fetchUser, async (req, res) => {
		try {
			const result = await AuthModule.deleteUserById(req?.params?.id);
			if (result) {
				res.status(200).json({ success: true, result: result });
			} else {
				res.status(404).json({ success: false, message: "Not Found" });
			}
		} catch (error) {
			res.status(500).json({
				success: true,
				message: "Internal server error",
			});
		}
	});

	app.use("/api/auth", router);
};
