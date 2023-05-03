// import { SchemaTypeOptions, SchemaType } from "mongoose";

export type TourType = {
	name: string;
	duration: number;
	maxGroupSize: number;
};

// SchemaTypeOptions<TourType>
//

export const tourSchema = {
	name: {
		type: String,
		required: [true, "A tour must have a name"],
		unique: true,
	},
	duration: {
		type: Number,
		required: [true, "A tour must have a durations"],
	},
	maxGroupSize: {
		type: Number,
		required: [true, "A tour must have a group size"],
	},
	difficulty: {
		type: String,
		required: [true, "A tour must have a difficulty"],
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, "A tour must have a price"],
	},
	priceDiscount: Number,
	summary: {
		type: String,
		trim: true,
		required: [true, "A tour must have a summary description"],
	},
	description: {
		type: String,
		trim: true,
	},
	imageCover: {
		type: String,
		required: [true, "A tour must have a image cover"],
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
	startDates: [Date],
};
