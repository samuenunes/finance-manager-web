
export interface Income {
  id: number;
  description: string;
  amount: number;
  category: IncomeCategory;
  date: string;
}

export interface IncomeRequest {
  description: string;
  amount: number;
  category: number;
  date: string;
}

export interface IncomeResponse {
  id: number;
  description: string;
  amount: number;
  category: IncomeCategoryResponse;
  date: string;
}

export interface IncomeCategory {
  id: number;
  name: string;
  fixed: boolean;
}

export interface IncomeCategoryRequest {
  name: string;
  fixed: boolean;
}

export interface IncomeCategoryResponse {
  id: number;
  name: string;
  fixed: boolean;
}
