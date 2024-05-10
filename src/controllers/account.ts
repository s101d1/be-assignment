import {
  AccountData,
  AccountDataWithTransactions,
  CreateAccountData,
} from "../models/dto/account";
import { JWTPayloadData } from "../models/dto/auth";
import { GetRequestHandler, PostRequestHandler } from "../types/request-types";
import { ApiError } from "../utils/error";
import { prismaClient } from "../utils/prisma-client";
import { generateRandomNumber } from "../utils/string";

export const postUserAccountsHandler: PostRequestHandler<
  CreateAccountData,
  AccountData
> = async (req, reply) => {
  const jwtPayload = req.user as JWTPayloadData;

  const type = req.body.type?.trim()?.toUpperCase();
  const currency = req.body.currency?.trim()?.toUpperCase();
  const initialBalance = req.body.initialBalance;

  if (!type || type === "") {
    throw new ApiError(400, "Account Type is required");
  }
  if (!currency || currency === "") {
    throw new ApiError(400, "Currency is required");
  }

  const account = await prismaClient.account.findFirst({
    where: { ownerId: jwtPayload.userId, type: type },
  });
  if (account) {
    throw new ApiError(400, "Account already exists");
  }

  const createdAccount = await prismaClient.account.create({
    data: {
      type: type,
      accountNo: generateRandomNumber(10),
      currency: currency,
      balance: initialBalance,
      ownerId: jwtPayload.userId,
    },
  });

  return createdAccount;
};

export const getUserAccountsHandler: GetRequestHandler<
  AccountDataWithTransactions[]
> = async (req, reply) => {
  const jwtPayload = req.user as JWTPayloadData;

  const accounts = await prismaClient.account.findMany({
    where: { ownerId: jwtPayload.userId },
    include: {
      transactions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return accounts;
};
