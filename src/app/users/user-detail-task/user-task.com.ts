import { Component, computed, effect, inject, input } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { StatusBarComponent } from './user-status-bar/user-status.com';
import { Task } from '../../tasks/task.model';

@Component({
  selector: 'app-user-task',
  standalone: true,
  imports: [StatusBarComponent],
  templateUrl: './user-task.com.html',
  styleUrl: './user-task.com.css',
})
export class UserTaskDetailComponent {
  id = input.required<string>();
  private userService = inject(UserService);
  private router = inject(Router);

  userTasks = computed(() => this.userService.usersTask());

  userDetail = computed(() => this.userService.getSelectedUserDetail(this.id()));

  userReport = computed(() => {
    console.log(this.id());
    const tasks = this.userTasks();
    const initial: Record<string, Task[]> = {
      Pending: [],
      InProgress: [],
      Completed: [],
    };

    return tasks.reduce((acc, task) => {
      const status = task.status;
      if (acc[status]) {
        acc[status].push(task);
      }
      return acc;
    }, initial);
  });

  constructor() {
    effect(() => {
      const userId = this.id();
      if (userId) {
        this.userService.getUserTaskAsync(userId);
      }
    });
  }

  onNavigateBack() {
    this.router.navigate(['/home/users']);
  }

  getReportCount(status: string): number {
    return this.userReport()[status]?.length ?? 0;
  }

  onNavigatetoTask(task: Task) {
    this.router.navigate(['/home/tasks', task.taskId], {
      queryParams: {
        task: JSON.stringify(task),
      },
    });
  }

  onEdit(id: number) {}
  onDelete(id: number) {}
}
