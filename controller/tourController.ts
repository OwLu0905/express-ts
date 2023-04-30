import { NextFunction, Request, Response } from "express";

import { Tour } from "../models/tourModel";
import { TourType } from "../schema/tours";

export const getAllTours = async (req: Request, res: Response) => {
	try {
		const allTours = await Tour.find();
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

export const createTour = async (req: Request, res: Response) => {
	// NOTE call new document
	// const newTours = new Tour({
	// 	name:'few',
	// 	price:33,
	// 	rating: 4.1
	// })

	// NOTE : call existed docuemt
	try {
		const newTour = await Tour.create(req.body as TourType);
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
		const tour = await Tour.findByIdAndDelete(id );
		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		res.status(404).json({ status: "failed", message: err });
	}
}

