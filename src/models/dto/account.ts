import { TransactionData } from "./transaction";

export interface CreateAccountData {
  type: string;
  currency: string;
  initialBalance: number;
}

export interface AccountData {
  id: string;
  type: string;
  accountNo: string;
  currency: string;
  balance: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountDataWithTransactions extends AccountData {
  transactions: TransactionData[];
}

//// Constants

// Account Type
export const DEBIT = "DEBIT";
export const CREDIT = "CREDIT";
export const LOAN = "LOAN";
