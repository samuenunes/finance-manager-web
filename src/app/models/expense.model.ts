
export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface ExpenseRequest {
  description: string;
  amount: number;
  category: number;
  date: string;
}

export interface ExpenseResponse {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategoryResponse;
  date: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  fixed: boolean;
  essential: boolean;
}

export interface ExpenseCategoryRequest {
  name: string;
  fixed: boolean;
  essential: boolean;
}

export interface ExpenseCategoryResponse {
  id: number;
  name: string;
  fixed: boolean;
  essential: boolean;
}
