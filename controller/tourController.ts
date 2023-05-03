import { NextFunction, Request, Response } from "express";

import { Tour } from "../models/tourModel";

import APIFeatures from "../utils/apiFeatures";


export interface QueryTourType {
	page: string;
	sort: string;
	limit: string;
	fields: string;
}

export type QueryReturnType = any;

export const getAllTours = async (
	req: Request<any, any, any, QueryTourType>,
	res: Response
) => {
	try {
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
	} catch (err) {
		res.status(400).json({
			status: "failed",
			message: err,
		});
	}
};

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

export const createTour = async (req: Request, res: Response) => {
	// NOTE call new document
	// const newTours = new Tour({
	// 	name:'few',
	// 	price:33,
	// 	rating: 4.1
	// })

	// NOTE : call existed docuemt
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	} catch (err) {
		res.status(400).json({ status: "failed", message: err });
	}
};

//////////////////

export const getTour = async (req: Request, res: Response) => {
	try {
		const tour = await Tour.findById(req.params.id);
		// ORIGINAL : Tour.findOne({_id: req.params.id})
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(400).json({ status: "failed", message: err });
	}
};

export const updateTour = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const updateBody = req.body;
		const tour = await Tour.findByIdAndUpdate(id, updateBody, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(400).json({ status: "failed", message: err });
	}
};

export const deleteTour = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const tour = await Tour.findByIdAndDelete(id);
		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		res.status(404).json({ status: "failed", message: err });
	}
};

// class APIFeatures {
// 	query: QueryWithHelpers<QueryReturnType, any>;
// 	queryString: QueryTourType;
// 	constructor(
// 		query: QueryWithHelpers<QueryReturnType, any>,
// 		queryString: QueryTourType
// 	) {
// 		this.query = query;
// 		this.queryString = queryString;
// 	}
//
// 	filter() {
// 		const { page, sort, limit, fields, ...queryObj } = this.queryString;
//
// 		let queryStr = JSON.stringify(queryObj);
// 		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//
// 		this.query = this.query.find(JSON.parse(queryStr));
//
// 		return this;
// 	}
//
// 	sort() {
// 		if (this.queryString.sort) {
// 			const sortBy = this.queryString.sort.split(".").join("");
// 			this.query = this.query.sort(sortBy);
// 		} else {
// 			this.query = this.query.sort("-createdAt");
// 		}
// 		return this;
// 	}
//
// 	limitFields() {
// 		if (this.queryString.fields) {
// 			const fields = this.queryString.fields.split(".").join(" ");
// 			this.query = this.query.select(fields);
// 		} else {
// 			this.query = this.query.select("-__v");
// 		}
// 		return this;
// 	}
//
// 	pagination() {
// 		const pages = +this.queryString.page * 1 || 1;
// 		const limits = +this.queryString.limit * 1 || 10;
// 		const skip = (pages - 1) * limits;
//
// 		// page=2&limit=10, 1-10, 11-20, 21-30
// 		this.query = this.query.skip(skip).limit(limits);
//
// 		return this;
// 	}
// }
