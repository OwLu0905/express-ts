// NOTE : express env
import dotenv from "dotenv";

// NOTE : database
import mongoose from "mongoose";

// NOTE : app
import app from "./app";


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
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});
