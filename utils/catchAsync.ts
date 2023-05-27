import { NextFunction, Request, Response } from "express";

export const catchAsync =
	<B, Q>(
		fn: (
			req: Request<any, B, any, Q>,
			res: Response,
			next: NextFunction
		) => Promise<any>
	) =>
		(req: Request<any, B, any, Q>, res: Response, next: NextFunction) => {
			// fn(req, res, next).catch((err: Error) => next(err));
			fn(req, res, next).catch((err: Error) => next(err));
		};
