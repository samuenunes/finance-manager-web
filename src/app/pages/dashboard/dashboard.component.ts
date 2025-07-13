import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStatsResponse, BalanceHistoryItem, MonthlyStatResponse } from '../../models';
import { CurrencyUtils } from '../../utils/currency.utils';
import { LucideIconComponent } from '../../shared/icons/lucide-icon.component';
import { LoadingComponent } from '../../shared/components/loading.component';
import { ChartComponent } from './chart.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, LoadingComponent, ChartComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  stats!: DashboardStatsResponse;
  balanceHistory: BalanceHistoryItem[] = [];

  monthlyData: any[] = [];
  monthlyLabels: string[] = [];
  balanceData: number[] = [];
  balanceLabels: string[] = [];
  categoryData: number[] = [];
  categoryLabels: string[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }


  private loadDashboard(): void {
    this.isLoading = true;

    forkJoin({
      stats: this.dashboardService.getStats(),
      balanceHistory: this.dashboardService.getBalanceHistory(),
      monthlyStats: this.dashboardService.getMonthlyStats(new Date().getFullYear())
    }).subscribe({
      next: ({ stats, balanceHistory, monthlyStats }) => {
        this.stats = stats;
        this.balanceHistory = balanceHistory;

        this.prepareCategoryData();
        this.prepareBalanceData();
        this.prepareMonthlyChartData(monthlyStats);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.isLoading = false;
      }
    });
  }


  private prepareBalanceData(): void {
    this.balanceLabels = this.balanceHistory.map(item => item.label);
    this.balanceData = this.balanceHistory.map(item => item.balance);
  }

  private prepareCategoryData(): void {
    const categories = this.stats.expensesByCategory;
    this.categoryLabels = Object.keys(categories);
    this.categoryData = Object.values(categories);
  }

  private prepareMonthlyChartData(monthlyStats: MonthlyStatResponse[]): void {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
  
    const dataMap = new Map<number, MonthlyStatResponse>();
    monthlyStats.forEach(stat => dataMap.set(stat.month-1, stat));
  
    this.monthlyLabels = months;
    this.monthlyData = months.map((_, index) => {
      const stat = dataMap.get(index);
      return {
        income: stat?.totalIncomes ?? 0,
        expenses: stat?.totalExpenses ?? 0
      };
    });
  }
  
  formatCurrency(value: number): string {
    return CurrencyUtils.formatBRL(value);
  }

  getBalanceColor(balance: number): string {
    return balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  }

  getYear(): number{
    return new Date().getFullYear();
  }
}