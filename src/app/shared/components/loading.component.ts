
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  `
})
export class LoadingComponent {}
