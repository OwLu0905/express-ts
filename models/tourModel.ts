import mongoose from "mongoose";

// NOTE Sehcma  && Schema Type
import { tourSchema } from "../schema/tours";
import type { TourType } from "../schema/tours";

const toursSchema = new mongoose.Schema<TourType>(tourSchema, {
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
}

toursSchema.virtual("durationWeeks").get(function(this: IToursDocument) {
	return this.get("duration");

});

// TODO : create
export const Tour = mongoose.model("Tour", toursSchema);
