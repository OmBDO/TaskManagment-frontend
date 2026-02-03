import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Priority, Task, TaskStatus } from '../../task.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { TaskServices } from '../../tasks.service';
import { Router } from '@angular/router';
import { UserService } from '../../../users/user.service';

@Component({
  selector: 'app-task-add-dialog',
  templateUrl: './add-option.html',
  styleUrl: './add-option.css',
  standalone: true,
  imports: [FormsModule],
})
export class TaskAddDialogComponent implements OnInit {
  private taskService = inject(TaskServices);
  private authService = inject(AuthService);
  private router = inject(Router);
  StatusEnum = TaskStatus;
  private userServices = inject(UserService);
  usersDetail = this.userServices.usersDetail;
  readonly statuses: TaskStatus[] = [
    TaskStatus.InProgress,
    TaskStatus.Pending,
    TaskStatus.Completed,
  ];
  constructor() {
    this.userServices.usersDetailAsync();

    console.log(this.usersDetail());
  }

  taskModel!: Task;
  dateString: string = '';
  minDate: string = '';
  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.dateString = this.minDate;
    this.taskModel = {
      taskId: Math.floor(Math.random() * 1000000),
      title: '',
      dueDate: new Date(),
      priority: Priority.Low,
      status: TaskStatus.Pending,
      isCompleted: false,
      description: '',
      userId: this.authService.authUser()?.id ?? '',
    };
  }

  onSave() {
    if (this.taskModel.title == '' || this.taskModel.description == '') {
      return;
    }
    this.taskService.addTask(this.taskModel);
    this.router.navigate(['/task']);
  }

  onCancel() {
    this.router.navigate(['/task']);
  }
}
