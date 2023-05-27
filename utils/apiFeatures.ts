import { QueryWithHelpers } from "mongoose";
import { QueryReturnType, QueryTourType } from "../controller/tourController";

class APIFeatures {
	query: QueryWithHelpers<QueryReturnType, any>; queryString: QueryTourType;
	constructor(
		query: QueryWithHelpers<QueryReturnType, any>,
		queryString: QueryTourType
	) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const { page, sort, limit, fields, ...queryObj } = this.queryString;

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(".").join("");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(".").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
	}

	pagination() {
		const pages = +this.queryString.page * 1 || 1;
		const limits = +this.queryString.limit * 1 || 10;
		const skip = (pages - 1) * limits;

		// page=2&limit=10, 1-10, 11-20, 21-30
		this.query = this.query.skip(skip).limit(limits);

		return this;
	}
}
export default APIFeatures
