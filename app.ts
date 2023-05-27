import express from "express";
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import AppError from "./utils/appError";
import { errorHelper } from "./controller/errorController";

interface CustomError extends ErrorRequestHandler {
	code?: number;
	status?: string;
	statusCode?: number;
	message?: string;
}

interface Errors extends Error {
	status?: string;
	statusCode?: number;
}

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	// res.status(404).json({
	// 	status: "fail",
	// 	// NOTE : req.originalUrl => original request method
	// 	message: `Can't find ${req.originalUrl} on this server`,
	// });
	//
	// NOTE : create an error
	// const err = new Error(
	// 	`123 Can't find ${req.originalUrl} on this server`
	// ) as unknown as Errors;
	//
	// err.status = "fail";
	// err.statusCode = 404;

	const errMsg = new AppError(
		`123 Can't find ${req.originalUrl} on this server`,
		404
	);

	next(errMsg);
});

app.use(errorHelper);

export default app;
