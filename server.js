const express = require("express");
const app = express(0);
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// This routes is run default and make sure that Server is running...
app.get("/", (req, res) => {
	res.send({ message: "Hello Sarfaraz !" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/role.routes")(app);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
	console.log(`YOUR Server is Running On http://localhost:${PORT}`);
});
