/**
 * @module role
 * @description Authentication module for handling role access control.
 * @date 01-Nov-2024
 * @author Mohammad Sarfaraz
 */

const db = require("./db");

//------------ Add new role role -------------
async function createNewRole(body) {
	// it takes two parameter user_id also
	try {
		let insertQuery = `INSERT INTO roles(role_name , status , createdbyuser , updatedbyuser) values`;
		let values = [];
		let k = 0;

		body?.forEach((element) => {
			insertQuery += `($${++k}, $${++k}, $${++k}, $${++k}),`;

			values.push(
				element.role_name,
				element.status,
				element.createdbyuser,
				element.updatedbyuser
			);
		});

		insertQuery = insertQuery.slice(0, -1);
		insertQuery += ` RETURNING *`;
		// console.log("INERT-Query-->>", insertQuery);
		const result = await db.query(insertQuery, values);
		return result.rows;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

// fetch role byId | all
async function fetchRoles(id) {
	try {
		let query = `SELECT * FROM roles`;
		id ? (query += ` WHERE role_id = $1`) : null;

		const userRecord = await db.query(query, id ? [id] : null);
		return userRecord.rows;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

// START Update role by id
async function updateRoleById(data, id) {
	try {
		const buildUpdateQuery = await buildQuery(data, id);
		const result = await db.query(
			buildUpdateQuery.text,
			buildUpdateQuery.values
		);
		return result.rows;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

async function buildQuery(data, id) {
	if (!id || !data || Object.keys(data).length === 0) {
		throw new Error("Invalid data or ID provided.");
	}

	let query = `UPDATE roles SET `;
	const fields = Object.keys(data);
	const values = [];

	fields.forEach((field, index) => {
		query += `${field} = $${index + 1}, `;
		values.push(data[field]);
	});

	query = query.slice(0, -2);
	query += ` WHERE id = $1 RETURNING *`;
	values.push(id);
	return { text: query, values };
}
/*  END ./  */

// delete role byId
async function deleteRoleById(id) {
	try {
		let deleteQuery = `DELETE FROM roles WHERE role_id = $1`;
		const result = await db.query(query, [id]);
		return result;
	} catch (error) {
		console.log("SERVER-ERROR-->>", error);
		throw error;
	}
}

module.exports = {
	fetchRoles,
	createNewRole,
	updateRoleById,
	deleteRoleById,
};
