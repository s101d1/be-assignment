import { LoginData, SignUpData, UserTokenData } from "../models/dto/auth";
import { PostRequestHandler } from "../types/request-types";
import { ApiError } from "../utils/error";
import { prismaClient } from "../utils/prisma-client";
import bcrypt from "bcryptjs";

export const postSignUpHandler: PostRequestHandler<
  SignUpData,
  UserTokenData
> = async (req, reply) => {
  const email = req.body.email?.trim()?.toLowerCase();
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const name = req.body.name?.trim();

  if (!email || email === "") {
    throw new ApiError(400, "E-mail is required");
  }
  if (!password || password === "") {
    throw new ApiError(400, "Password is required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Confirm Password doesn't match");
  }
  if (!name || name === "") {
    throw new ApiError(400, "Name is required");
  }

  const user = await prismaClient.user.findUnique({
    where: { email: email },
  });
  if (user) {
    throw new ApiError(400, "E-mail already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await prismaClient.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
    },
  });

  const token = req.server.jwt.sign(
    { email: createdUser.email, userId: createdUser.id },
    {
      expiresIn: "1h",
    }
  );

  return {
    userId: createdUser.id,
    token: token,
  };
};

export const postLoginHandler: PostRequestHandler<
  LoginData,
  UserTokenData
> = async (req, reply) => {
  const email = req.body.email?.trim()?.toLowerCase();
  const password = req.body.password;

  if (!email || email === "") {
    throw new ApiError(400, "E-mail is required");
  }
  if (!password || password === "") {
    throw new ApiError(400, "Password is required");
  }

  const user = await prismaClient.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordEqual = await bcrypt.compare(password, user.password);
  if (!isPasswordEqual) {
    throw new ApiError(400, "Invalid email or password");
  }

  const token = req.server.jwt.sign(
    { email: user.email, userId: user.id },
    {
      expiresIn: "1h",
    }
  );

  return {
    userId: user.id,
    token: token,
  };
};
