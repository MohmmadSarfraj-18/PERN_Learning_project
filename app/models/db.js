// database connection file
const Pool = require("pg").Pool;
const config = require("../config/db.config");

const DB = new Pool({
	host: config.HOST,
	user: config.USERNAME,
	password: config.PASSWORD,
	database: config.DATABASE,
	port: config.PORT,
});

DB.connect()
	.then(() => console.log("Database successfully connected..!!"))
	.catch((err) => console.error("Connection error", err.stack));

module.exports = DB;
