/**
 * @module role
 * @description Handles routing for role-related endpoints
 * @date 01-Nov-2024
 * @author Mohammad Sarfaraz
 */

const express = require("express");
const Role = require("../models/role.module");
const fetchUser = require("../middleware/fetchUser");

module.exports = (app) => {
	const router = express.Router();

	/*-------------- New User Role -------------*/
	router.post("/", fetchUser, async (req, res) => {
		try {
			// need to check record duplicate

			const result = await Role.createNewRole(req.body);

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

	/*-------------- fetch All/ById Roles -------------*/
	router.get("/:id?", fetchUser, async (req, res) => {
		try {
			const result = await Role.fetchRoles(req?.params?.id);
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

	/*-------------- Update Role ById --------------*/
	router.put("/", fetchUser, async (req, res) => {
		try {
			const result = await Role.updateRoleById(req.body, req.params.id);
			if (result) {
				res.status(200).json({ success: true, result: result });
			} else {
				res.status(404).json({ success: false, message: " Not found" });
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "internal server error",
			});
		}
	});

	/*-------------- Delete Role By Id -------------*/
	router.delete("/:id", fetchUser, async (req, res) => {
		try {
			const result = await AuthModule.deleteRoleById(req?.params?.id);
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

	app.use("/api/role", router);
};
