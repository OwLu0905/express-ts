import mongoose from "mongoose";

// NOTE Sehcma  && Schema Type
import { tourSchema } from "../schema/tours";
import type { TourType } from "../schema/tours";

const toursSchema = new mongoose.Schema<TourType>(tourSchema);

// TODO : create
export const Tour = mongoose.model("Tour", toursSchema);
