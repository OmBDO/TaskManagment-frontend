import { Component, inject, input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDeleteDialogComponent } from './delete-option/delete-dialog.component';
import { Task, TaskStatus } from '../task.model';
import { TaskServices } from '../tasks.service';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-task-option',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css'],
})
export class TaskOptionComponent {
  private taskService = inject(TaskServices);
  private router = inject(Router);
  options = [
    { label: 'Edit Task', action: 'edit' },
    { label: 'Delete Task', action: 'delete' },
    { label: 'Mark as Complete', action: 'complete' },
  ];
  selectedTask = input.required<Task>();
  closeOption = output();
  handleDeleteConfirmation(confirmed: boolean): void {
    if (confirmed) {
      this.taskService.deleteTask(this.selectedTask().taskId);
    }
  }

  handleEditeComplete(task: Task | undefined) {
    if (task == undefined) return;
    this.taskService.editTask(task.taskId, task);
  }

  onOptionSelect(action: string): void {
    if (action == 'delete') {
      this.router.navigate(['/home/tasks/delete'], {
        queryParams: {
          taskId: this.selectedTask().taskId,
        },
      });
    }
    if (action == 'edit') {
      this.router.navigate(['/home/tasks/edit'], {
        state: { data: this.selectedTask() },
        queryParams: {
          taskId: this.selectedTask().taskId,
        },
      });
    }

    if (action == 'complete') {
      this.markComplete();
    }
  }

  markComplete() {
    const task: Task = { ...this.selectedTask(), status: TaskStatus.Completed, isCompleted: true };

    this.taskService.editTask(task.taskId, task);
    this.closeOption.emit();
  }
}
