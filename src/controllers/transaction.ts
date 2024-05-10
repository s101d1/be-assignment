import {
  COMPLETED,
  CreateTransactionData,
  FAILED,
  SEND,
  STARTED,
  TransactionData,
  WITHDRAW,
} from "../models/dto/transaction";
import { PostRequestHandler } from "../types/request-types";
import { ApiError } from "../utils/error";
import { prismaClient } from "../utils/prisma-client";

export const postSendTransactionHandler: PostRequestHandler<
  CreateTransactionData,
  TransactionData
> = async (req, reply) => {
  return createTransaction(req.body, SEND);
};

export const postWithdrawTransactionHandler: PostRequestHandler<
  CreateTransactionData,
  TransactionData
> = async (req, reply) => {
  return createTransaction(req.body, WITHDRAW);
};

const createTransaction = async (
  createTransactionData: CreateTransactionData,
  type: string
) => {
  const currency = createTransactionData.currency.trim()?.toUpperCase();
  const amount = createTransactionData.amount;
  const toAddress = createTransactionData.toAddress?.trim();
  const accountId = createTransactionData.accountId?.trim()?.toLowerCase();

  if (!currency || currency === "") {
    throw new ApiError(400, "Currency is required");
  }
  if (amount <= 0) {
    throw new ApiError(400, "Invalid amount value: " + amount);
  }
  if (!toAddress || toAddress === "") {
    throw new ApiError(400, "To-Address is required");
  }
  if (!accountId || accountId === "") {
    throw new ApiError(400, "Account ID is required");
  }

  const account = await prismaClient.account.findUnique({
    where: { id: accountId },
  });
  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  if (
    account.balance.comparedTo(0) <= 0 ||
    account.balance.comparedTo(amount) < 0
  ) {
    throw new ApiError(400, "Not enough balance");
  }

  const createdTransaction = await prismaClient.transaction.create({
    data: {
      type: type,
      currency: currency,
      amount: amount,
      toAddress: toAddress,
      accountId: accountId,
      status: STARTED,
    },
  });

  // Simulate long running process
  setTimeout(async () => {
    try {
      // Update transaction status and account balance
      await prismaClient.transaction.update({
        data: {
          status: COMPLETED,
          account: {
            update: {
              data: {
                balance: {
                  decrement: createdTransaction.amount,
                },
              },
            },
          },
        },
        where: {
          id: createdTransaction.id,
        },
      });

      console.log("Transaction and account balance updated");
    } catch (error) {
      await prismaClient.transaction.update({
        data: {
          status: FAILED,
        },
        where: {
          id: createdTransaction.id,
        },
      });
      throw error;
    }
  }, 30 * 1000); // 30 seconds

  return createdTransaction;
};
