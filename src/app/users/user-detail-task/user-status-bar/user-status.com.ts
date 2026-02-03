import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-status-bar',
  standalone: true,
  templateUrl: './user-status.com.html',
  styleUrl: './user-status.com.css',
})
export class StatusBarComponent {
  pending = input<number>(0);
  inProgress = input<number>(0);
  completed = input<number>(0);

  ratios = computed(() => {
    const p = this.pending();
    const i = this.inProgress();
    const c = this.completed();
    const total = p + i + c;

    if (total === 0) return { p: 0, i: 0, c: 0 };

    return {
      p: (p / total) * 100,
      i: (i / total) * 100,
      c: (c / total) * 100,
    };
  });
}
