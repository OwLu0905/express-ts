import { NextFunction, Request, Response } from "express";

import { Tour } from "../models/tourModel";

import APIFeatures from "../utils/apiFeatures";
import { catchAsync } from "../utils/catchAsync";

import AppError from "../utils/appError";

export interface QueryTourType {
	page: string;
	sort: string;
	limit: string;
	fields: string;
}

export type QueryReturnType = any;

export const getAllTours = catchAsync(
	async (
		req: Request<any, any, any, QueryTourType>,
		res: Response,
		next: NextFunction
	) => {
		// const { page, sort, limit, fields } = req.query;
		// const { page, sort, limit, fields, ...queryObj } = req.query;

		// // 1) Filtering
		// const { page, sort, limit, fields, ...queryObj } = req.query;
		// let queryStr = JSON.stringify(queryObj);
		// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		//
		// let query = Tour.find(JSON.parse(queryStr)) as QueryWithHelpers<
		// 	QueryReturnType,
		// 	any
		// >;
		//
		// // 2) Sotring
		// if (req.query.sort) {
		// 	query = query.sort(req.query.sort); // query is MONGODB retunr Query
		// 	// sort('price ratingsAverage')
		// } else {
		// 	query = query.sort("-createdAt");
		// }
		//
		// // 3) Field limiting
		// if (req.query.fields) {
		// 	const fields = req.query.fields.split(".").join(" ");
		// 	query = query.select(fields);
		// } else {
		// 	query = query.select("-__v");
		// }
		//
		// // 4) Pagination
		// const pages = +req.query.page * 1 || 1;
		// const limits = +req.query.limit * 1 || 1;
		// const skip = (pages - 1) * limits;
		//
		// // page=2&limit=10, 1-10, 11-20, 21-30
		// query = query.skip(skip).limit(limits);
		//
		// if (req.query.page) {
		// 	const numTours = await Tour.countDocuments();
		// 	if (skip >= numTours) throw new Error("This page does not exist");
		// }

		// EXECUTE QUERY
		const features = new APIFeatures(Tour.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.pagination();

		const allTours = await features.query;

		// TODO : method 1
		// const allTours = await Tour.find({
		// 	duration: 5,
		// 	maxGroupSize: 8,
		// });

		// TODO : method 2
		// const allTours = await Tour.find()
		// 	.where("duration")
		// 	.equals(5)
		// 	.where("difficulty")
		// 	.equals("easy");

		// SEND RESPONSE
		res.status(200).json({
			status: "success",
			results: allTours.length,
			data: {
				allTours,
			},
		});
	}
);

// NOTE Alias (run middleware)
export const aliasTopTours = async (
	req: Request<any, any, any, QueryTourType>,
	res: Response,
	next: NextFunction
) => {
	req.query.limit = "5";
	req.query.sort = "-ratingsAverage,summary,difficulty";
	next();
};

export const createTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const newTour = await Tour.create(req.body);

		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	}
);

//////////////////

export const getTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const tour = await Tour.findById(req.params.id);
		// ORIGINAL : Tour.findOne({_id: req.params.id})

		if (!tour) {
			return next(new AppError("No tour found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	}
);

export const updateTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		const updateBody = req.body;
		const tour = await Tour.findByIdAndUpdate(id, updateBody, {
			new: true,
			runValidators: true,
		});

		if (!tour) {
			return next(new AppError("No tour found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	}
);

export const deleteTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		const tour = await Tour.findByIdAndDelete(id);

		if (!tour) {
			return next(new AppError("No tour found with that ID", 404));
		}

		res.status(204).json({
			status: "success",
			data: null,
		});
	}
);

export const getTourStats = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5 } },
			},
			{
				$group: {
					_id: { $toUpper: "$difficulty" },
					// _id: "$ratingsAverage",
					numTours: { $sum: 1 },
					numRatings: { $sum: "$ratingsQuantity" },
					avgRating: { $avg: "$ratingsAverage" },
					avgPrice: { $avg: "$price" },
					minPrice: { $min: "$price" },
					maxPrice: { $max: "$price" },
				},
			},
			{
				$sort: { avgPrice: -1 },
			},
			// {
			// 	$match: { _id: { $ne: "EASY" } },
			// },
		]);
		res.status(200).json({
			status: "success",
			data: {
				stats,
			},
		});
	}
);

export const getMonthlyPlan = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const year = +req.params.year; // 2021

		const plan = await Tour.aggregate([
			{
				$unwind: "$startDates",
			},
			{
				$match: {
					startDates: {
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: { $month: "$startDates" },
					numTourStarts: { $sum: 1 },
					tours: { $push: "$name" },
				},
			},
			{
				$addFields: { month: "$_id" },
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: {
					numTourStarts: -1,
				},
			},
			{
				$limit: 6,
			},
		]);

		// res.status(200).send("<h1>jfiweojfiowe</h1>")
		res.status(200).json({
			status: "success",
			data: plan,
		});
	}
);
