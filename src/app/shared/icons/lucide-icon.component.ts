
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lucide-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size" 
      [attr.viewBox]="viewBox"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.stroke-width]="strokeWidth"
      [attr.stroke-linecap]="strokeLinecap"
      [attr.stroke-linejoin]="strokeLinejoin"
      [class]="class">
      <path [attr.d]="getIconPath()"/>
    </svg>
  `
})
export class LucideIconComponent {
  @Input() name: string = '';
  @Input() size: string | number = 24;
  @Input() viewBox: string = '0 0 24 24';
  @Input() fill: string = 'none';
  @Input() stroke: string = 'currentColor';
  @Input() strokeWidth: number = 2;
  @Input() strokeLinecap: string = 'round';
  @Input() strokeLinejoin: string = 'round';
  @Input() class: string = '';

  private icons: { [key: string]: string } = {
    // Navigation
    'layout-dashboard': 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
    'trending-up': 'm3 17 6-6 4 4 8-8M21 7v6h-6',
    'trending-down': 'M3 7l6 6 4-4 8 8M21 17V11h-6',
    'tag': 'M9 5H2l7 7-7 7h7l7-7-7-7z',
    'menu': 'M3 12h18M3 6h18M3 18h18',
    'x': 'M18 6 6 18M6 6l12 12',
    
    // Actions
    'plus': 'M12 5v14M5 12h14',
    'edit': 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    'trash': 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'save': 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
    'search': 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
    
    // User & Settings
    'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    'settings': 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    'log-out': 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    
    // Theme
    'sun': 'M12 1v2M12 21v2m9-9h2M1 12h2m15.5-6.5L19 4M5 20l1.5-1.5M20 20l-1.5-1.5M4 4l1.5 1.5',
    'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    
    // Finance
    'dollar-sign': 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    'credit-card': 'M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 10h18',
    'wallet': 'M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5zM16 12h2',
    
    // Arrows & Navigation
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-up': 'M18 15l-6-6-6 6',
    'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
    'arrow-right': 'M5 12h14M12 5l7 7-7 7',
    
    // Status & Feedback
    'check': 'M20 6 9 17l-5-5',
    'check-circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01',
    'info': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01',
    'alert-triangle': 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    
    // Charts & Analytics
    'bar-chart': 'M12 20V10M18 20V4M6 20v-6',
    'pie-chart': 'M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z',
    'line-chart': 'M3 3v18h18M7 12l4-4 4 4 6-6',
    'activity': 'M22 12h-4l-3 9L9 3l-3 9H2',
    
    // Sidebar
    'sidebar': 'M3 3h6v18H3zM21 9v6',
    'panel-left': 'M3 3h6v18H3zM21 9v6',
    'panel-right': 'M15 3h6v18h-6zM3 9v6',
    
    // Empty states
    'inbox': 'M22 12h-6l-2 3h-4l-2-3H2M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6M22 12V6a2 2 0 0 1-2-2H4a2 2 0 0 1-2 2v6',
    'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8'
  };

  getIconPath(): string {
    return this.icons[this.name] || '';
  }
}
