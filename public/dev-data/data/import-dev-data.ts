import fs from "fs";
// NOTE : express env
import dotenv from "dotenv";

// NOTE : database
import mongoose from "mongoose";

// NOTE : TOUR model
import { Tour } from "./../../../models/tourModel";

dotenv.config({ path: `./config.env` });

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

// TODO : read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"))

// TODO : import DATA info DB
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('data successfully loaded!')
	} catch(err) {
    console.log(err)
  }
}


const deleteData = async () => {
  try {
    await Tour.deleteMany()
		process.exit()
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === "--import") {
	importData()
} else if (process.argv[2] === "--delete") {
	deleteData()
}

console.log(process.argv[2])
