
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
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
      <ng-content></ng-content>
    </svg>
  `
})
export class IconComponent {
  @Input() size: string | number = 24;
  @Input() viewBox: string = '0 0 24 24';
  @Input() fill: string = 'none';
  @Input() stroke: string = 'currentColor';
  @Input() strokeWidth: number = 2;
  @Input() strokeLinecap: string = 'round';
  @Input() strokeLinejoin: string = 'round';
  @Input() class: string = '';
}
