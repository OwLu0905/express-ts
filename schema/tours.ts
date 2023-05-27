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
		maxLength: [40, "A tour name must have less or euqal to 40 characters"],
		minLength: [10, "A tour name must have greater or euqal to 10 characters"],
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
		enum: {
			values: ["easy", "medium", "difficult"],
			message: "Difficulty is xxx",
		},
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
		min: [1, "Rating must be above 1."],
		max: [1, "Rating must be below 5."],
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, "A tour must have a price"],
	},
	priceDiscount: {
		validate: {
			// NOTE : this only points to current doc on NEW document creation
			validator: function(val: number): boolean {
				// @ts-ignore
				return val < this.price;
			},
			message: "Discount price {VALUE} should be less than price",
		},
		type: Number,
	},
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
	secretTour: { type: Boolean, defualt: false },
};
