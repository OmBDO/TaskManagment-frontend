import { Component, inject, OnInit, output } from '@angular/core';
import { Task, TaskStatus } from '../../task.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskServices } from '../../tasks.service';

@Component({
  selector: 'app-task-edit-dialog',
  templateUrl: './edit-option.html',
  styleUrl: './edit-option.css',
  imports: [FormsModule],
})
export class TaskEditDialogComponent implements OnInit {
  private taskService = inject(TaskServices);
  private router = inject(Router);

  StatusEnum = TaskStatus;
  readonly statuses: TaskStatus[] = [
    TaskStatus.Pending,
    TaskStatus.InProgress,
    TaskStatus.Completed,
  ];
  minDate: string = '';
  taskModel!: Task;
  dateString: string = '';
  taskId!: number;
  constructor() {
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras.state as { data: Task };
    this.taskId = (navigation?.extras.queryParams as { taskId: number }).taskId;
    if (state && state.data) {
      this.taskModel = JSON.parse(JSON.stringify(state.data));
    }
  }

  ngOnInit() {
    if (!this.taskModel) {
      console.warn('No state found, navigating back');
      this.onCancel();
      return;
    }

    if (this.taskModel.dueDate) {
      this.dateString = new Date(this.taskModel.dueDate).toISOString().split('T')[0];
    }
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  onSave() {
    this.taskModel.isCompleted = this.taskModel.status === TaskStatus.Completed;
    console.log(this.taskModel.title, this.taskModel.description);
    if (this.taskModel.title == '' || this.taskModel.description == '') {
      console.log('cancel');
      return;
    }

    console.log('Changes detected. Emitting update:', this.taskModel);
    this.taskService.editTask(this.taskModel.taskId, this.taskModel);
    this.router.navigate(['/']);
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
