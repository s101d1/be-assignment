export interface CreateTransactionData {
  currency: string;
  amount: number;
  toAddress: string;
  accountId: string;
}

export interface TransactionData {
  id: string;
  type: string;
  currency: string;
  amount: number;
  toAddress: string;
  status: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

//// Constants

// Transaction Type
export const SEND = "SEND";
export const WITHDRAW = "WITHDRAW";

// Transaction Status
export const STARTED = "STARTED";
export const COMPLETED = "COMPLETED";
export const FAILED = "FAILED";
