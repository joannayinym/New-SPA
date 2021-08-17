export enum SelectType {
  category = "category",
  type = "type",
  date = "date",
}

export interface StatementDetail {
  id: string;
  type: string;
  category: string;
  amount: number;
  balance: number;
  transaction_date: string;
  day_sequence: number;
}

export interface SummaryData {
  key: string;
  amount: number;
  balance: number;
}
