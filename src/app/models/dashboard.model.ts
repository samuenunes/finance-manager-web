export interface DashboardStatsResponse {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyBalance: number;
    incomesByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
}
  
export interface BalanceHistoryItem {
    label: string;
    balance: number;
}

export interface MonthlyStatResponse {
    year: number;
    month: number;
    totalIncomes: number;
    totalExpenses: number;
}
  