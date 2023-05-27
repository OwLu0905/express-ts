// NOTE : express env
import dotenv from "dotenv";

// NOTE : database
import mongoose from "mongoose";

// NOTE : app
import app from "./app";

// NOTE : unhandle rejection
process.on("unhandledRejection", (err: Error) => {
	// console.log(err.name, err.message);
	console.log("Unhandler Rejection!!!!!! Shuting down...");
	console.log(err);

	process.exit(1);
	// server.close(() => {
	// 	process.exit(1);
	// });
});

process.on("uncaughtException", (err: Error) => {
	console.log("Unhandler Rejection!!!!!! Shuting down...");
	console.log(err.name, err.message);

	process.exit(1);
	// server.close(() => {
	// 	process.exit(1);
	// });
});

dotenv.config({ path: "./config.env" });

const pass = process.env.MONGODB_PASS || "none";
const DB = (process.env.MONGODB_URL as string).replace("<PASSWORD>", pass);

mongoose
	// .connect(process.env.DATABASE_LOCAL as string, {
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		// console.log(connect.connections);
		console.log("DB connection successful");
	})
	.catch((err) => {
		console.log(err, "errr");
		console.log("connection failed");
	});

// TODO : FOR testing
// const testTour = new Tour({
// 	name: "The Forest Hiking",
// 	rating: 4.7,
// 	price: 497,
// });
//
// testTour
// 	.save()
// 	.then((doc) => {
// 		console.log(doc);
// 	})
// 	.catch((err) => console.log(err, "err"));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});

// console.log(x);
