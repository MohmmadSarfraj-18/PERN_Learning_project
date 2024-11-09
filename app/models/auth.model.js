/**
 * @module auth
 * @description Authentication module for handling user access control.
 * @date 31-Oct-2024
 * @author Mohammad Sarfaraz
 */

const db = require("./db");

// new user registration single or bulk insertion
async function newUserRegister(body) {
	try {
		let insertQuery = `INSERT INTO users(first_name , last_name , email , username , password , phone , role_id) values`;
		let values = [];
		let k = 0;

		body?.forEach((element) => {
			insertQuery += `($${++k}, $${++k}, $${++k}, $${++k}, $${++k}, $${++k}, $${++k}),`;

			values.push(
				element.firstname,
				element.lastname,
				element.email,
				element.username,
				element.password,
				element.phone,
				element.role_id
			);
		});

		insertQuery = insertQuery.slice(0, -1);
		insertQuery += ` RETURNING *`;
		// console.log("INERT-Query-->>", insertQuery);
		// console.log("values-->>", values);
		const result = await db.query(insertQuery, values);
		return result.rows;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

//--------  User information with role ---------
async function findUserByUsernameAndPassword(body) {
	try {
		let query = `SELECT u.*, r.role_name FROM users u
                    INNER JOIN roles r ON r.role_id = u.role_id
                    WHERE u.username = $1`;
		const result = await db.query(query, [body.username]);
		return result.rows;
	} catch (error) {
		throw error;
	}
}

// fetch user byId | all
async function fetchUsers(id) {
	try {
		let query = `SELECT * FROM users`;
		id ? (query += ` WHERE user_id = $1`) : null;

		const userRecord = await db.query(query, id ? [id] : null);
		return userRecord.rows;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

// delete user byId
async function deleteUserById(id) {
	try {
		let deleteQuery = `DELETE FROM users WHERE user_id = $1`;
		const result = await db.query(query, [id]);
		return result;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

module.exports = {
	fetchUsers,
	newUserRegister,
	deleteUserById,
	findUserByUsernameAndPassword,
};
