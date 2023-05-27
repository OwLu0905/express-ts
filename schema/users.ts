import { SchemaType } from "mongoose";
import validator from "validator";

export type UserType = {
	name: string;
	email: string;
	photo?: string;
	password: string;
	passwordConfirm: string;
};

export const userSchema = {
	name: {
		type: String,
		required: [true, "A user must have a name"],
	},
	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	photo: {
		type: String,
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minLength: 8,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			// NOTE : this only works on CREATE and SAVE !!!!
			validator: function(el: string): boolean {
				// @ts-ignore
				return el === (this.password as string);
			},
			message: "Passwords are not the same",
		},
	},
};
