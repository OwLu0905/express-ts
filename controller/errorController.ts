import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import AppError from "../utils/appError";

interface Errors extends Error {
	status?: string;
	statusCode: number;
	value?: any;
	path?: any;
}

const handleCastErrorDB = (err: Errors) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err: Errors) => {
	// TODO : get value from db and return to err msg
	// const value = err.errmsg.match('/A/')

	const message = `Duplicat field value x. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationFieldDB = (err: Errors) => {
	// const errors: any[] = Object.values(err?.errors).map((er) => {
	// 	return er.message;
	// });

	const message = `Invalid input data`;
	return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
	console.log("dev environment");
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err: AppError, res: Response) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
		// NOTE: Programming or other unknown error: don't leak error details
	} else {
		// TODO 1) : Log error
		console.error("ERROR", err);

		// TODO 2) : Send generic message
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};

export function errorHelper(
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (error.name === "CastError") {
			error = handleCastErrorDB(error);
		}
		// NOTE : mongodb has custom error code, e.g: 11000 => duplicate name
		if (error.code === 11000) {
			error = handleDuplicateFieldDB(error);
		}
		if (error.name === "ValidationError") {
			error = handleValidationFieldDB(error);
		}

		sendErrorProd(error, res);
	}
}
