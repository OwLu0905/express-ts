import mongoose from "mongoose";
import { userSchema } from "../schema/users";
import bcrypt from "bcryptjs";

// name, email, photo, password, passwordConfirm,
const usersSchema = new mongoose.Schema<any>(userSchema);

usersSchema.pre("save", async function(next) {
	// only run this function if password was actually modified
	if (!this.isModified("password")) {
		return next();
	}

	// Hash password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete PasswordConfirm field 
	this.passwordConfirm = undefined;

	next();
});

export const User = mongoose.model("User", usersSchema);
