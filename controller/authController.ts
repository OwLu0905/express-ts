import { User } from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import type { UserType } from "../schema/users";

import jwt from "jsonwebtoken";

// NOTE : add generic Express Request Type
// see more : https://plainenglish.io/blog/typed-express-request-and-response-with-typescript
//
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export const signup = catchAsync(
  async (
    req: TypedRequestBody<UserType>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password, passwordConfirm } = req.body;

    // NOTE : This is not a good method which anyone could pass all properties to create user
    // By restricting the input field, we can ensure that which role the user is. e.g: admin vs normal user
    // const newUser = await User.create(req.body); ❌
    //
    //
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      } as jwt.SignOptions
    );

    res.status(201).json({
      status: "success",
      token: token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = async (
  req: TypedRequestBody<UserType>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
};
