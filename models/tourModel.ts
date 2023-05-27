import mongoose from "mongoose";
import slugify from "slugify";

// NOTE Sehcma  && Schema Type
import { tourSchema } from "../schema/tours";
import type { TourType } from "../schema/tours";

const toursSchema = new mongoose.Schema<typeof tourSchema>(tourSchema, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

// toursSchema.virtual('durationWeeks').get(function(this:any) {
//
// 	return this.duration / 7
// })
// virtual property
// console.log(this, "thioejfiowejfowe");
interface IToursDocument extends mongoose.Document {
	duration: number;
	slug: string;
	name: string;
}

toursSchema.virtual("durationWeeks").get(function(this: IToursDocument) {
	return this.get("duration");
});

// NOTE : document middleware: runs before .save() and .create()
// toursSchema.pre("save", function(next) {
// 	// @ts-ignore
// 	this.slug = slugify(this.name, { lower: true });
// 	next();
// });
//
// toursSchema.post('save', function(doc,next){
// 	next()
// })
//
// NOTE : query middleware
// toursSchema.pre("find", function(next) {
toursSchema.pre(/^find/, function(next) {
	// @ts-ignore
	this.find({ secretTour: { $ne: true } });
	// @ts-ignore
	this.start = Date.now();
	next();
});

toursSchema.post(/^find/, function(docs, next) {
	// @ts-ignore
	console.log(`Query took ${Date.now() - this.start} ms`);
	// console.log(docs);
	next();
});

// NOTE : Aggregation middleware
toursSchema.pre("aggregate", function(next) {
	// @ts-ignore
	this.pipeline().unshift({
		$match: {
			secretTour: { $ne: true },
		},
	});
	// @ts-ignore
	// console.log(this.pipeline());
	next();
});

// TODO : create
export const Tour = mongoose.model("Tour", toursSchema);
