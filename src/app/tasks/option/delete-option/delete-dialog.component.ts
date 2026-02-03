import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskServices } from '../../tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
})
export class ConfirmationDeleteDialogComponent {
  private taskServices = inject(TaskServices);
  private router = inject(Router);
  private taskId!: number;

  constructor() {
    const navigation = this.router.currentNavigation();
    const stateVal = navigation?.extras.queryParams as { taskId: number };
    this.taskId = stateVal.taskId;
  }
  onConfirm(value: boolean): void {
    if (value) {
      this.taskServices.deleteTask(this.taskId);
    }
    this.router.navigate(['/home/task']);
  }
}
