const mongoose = require("mongoose");
const colors = require("colors");

const connectDatabase = async () => {
	await mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
		})
		.then((conn) => {
			console.log(
				"MongoDB connected ".green +
					`| server:`.bold +
					` ${conn.connection.host} | `.yellow +
					`database:`.bold +
					` ${conn.connection.db.databaseName}`.magenta
			);
		})
		.catch((error) => {
			console.log(
				`Error connecting to database : `.white + `${error.message}`.bold.red
			);
		});
};

module.exports = { connectDatabase };
