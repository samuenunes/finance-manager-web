
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <canvas #chartCanvas [width]="width" [height]="height"></canvas>
      <div *ngIf="!data || data.length === 0" 
           class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-gray-500 dark:text-gray-400">Sem dados para exibir</p>
      </div>
    </div>
  `
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() type: ChartType = 'line';
  @Input() data: any[] = [];
  @Input() labels: string[] = [];
  @Input() title: string = '';
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() options: any = {};

  private chart: Chart | null = null;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    console.log(this.data)
    if (!this.chartCanvas || !this.data || this.data.length === 0) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.getDatasets()
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!this.title,
            text: this.title,
            color: '#374151',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#374151',
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: this.getScales(),
        ...this.options
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private getDatasets(): any[] {
    if (this.type === 'pie' || this.type === 'doughnut') {
      return [{
        data: this.data,
        backgroundColor: [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
          '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }];
    }

    if (this.type === 'bar') {
      return [
        {
          label: 'Receitas',
          data: this.data.map((item: any) => item.income || 0),
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: this.data.map((item: any) => item.expenses || 0),
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 1
        }
      ];
    }

    // Line chart
    return [
      {
        label: 'Saldo',
        data: this.data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ];
  }

  private getScales(): any {
    if (this.type === 'pie' || this.type === 'doughnut') {
      return {};
    }

    return {
      x: {
        grid: {
          color: '#E5E7EB'
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#E5E7EB'
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: any) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value);
          }
        }
      }
    };
  }

  updateChart(newData: any[], newLabels?: string[]): void {
    if (!this.chart) return;

    this.data = newData;
    if (newLabels) {
      this.labels = newLabels;
      this.chart.data.labels = newLabels;
    }

    this.chart.data.datasets = this.getDatasets();
    this.chart.update();
  }
}
