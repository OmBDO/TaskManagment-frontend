import { Component, computed, inject, input, OnInit } from '@angular/core';
import { UserService } from '../../users/user.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskStatus } from '../task.model';
import { TaskServices } from '../tasks.service';
import { User } from '../../users/user.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.com.html',
  styleUrl: './task-detail.com.css',
})
export class TaskDetailComponent implements OnInit {
  taskId = input<number>();
  private router = inject(Router);
  private userService = inject(UserService);
  private taskService = inject(TaskServices);
  private route = inject(ActivatedRoute);
  userDetail = computed(() => this.userService.getSelectedUserDetail(this.taskDetail.userId));
  taskDetail!: Task;

  StatusEnum = TaskStatus;
  isDropdownOpen = false;
  currentStatus = '';

  constructor() {
    const taskJson = this.route.snapshot.queryParamMap.get('task');
    if (taskJson) {
      this.taskDetail = JSON.parse(taskJson);
    }
  }
  ngOnInit(): void {}

  convertDateFormat() {
    const date = new Date(this.taskDetail.dueDate);

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectStatus(status: string): void {
    this.currentStatus = status;
    this.isDropdownOpen = false;
    console.log(`Status updated to: ${status}`);
    this.taskDetail.status = status as TaskStatus;
    this.taskService.editTask(this.taskDetail.taskId, this.taskDetail);
  }

  navigatePop() {
    this.router.navigate(['/home/tasks']);
  }
}
