import { Component, computed, inject, OnInit } from '@angular/core';
import { TaskServices } from '../tasks/tasks.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Priority, Task } from '../tasks/task.model';
import { UserRole } from '../../core/enums/Role';
import { UserService } from './user.service';
import { UserTaskComponent } from './user-task/user-task.component';
import { UserTask } from './user.model';
import { UserTaskHeaderComponet } from './user-task-header/user-task-header.component';

@Component({
  selector: 'app-users',

  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css', '../tasks/tasks.component.css'],
  imports: [UserTaskComponent, UserTaskHeaderComponet, CommonModule],
})
export class UsersComponent implements OnInit {
  private taskService = inject(TaskServices);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  currentUser = this.authService.authUser;
  PriorityEnum = Priority;
  RoleEnum = UserRole;
  isDescending = false;
  ngOnInit(): void {
    if (this.tasks().length === 0) {
      this.taskService.fetchTask();
    }

    if (this.userService.usersDetail().length == 0) {
      this.userService.usersDetailAsync();
    }
    console.log(this.userService.usersDetail().length);
  }

  tasks = computed<UserTask[]>(() => {
    const allUsers = this.userService.usersDetail();
    const paginatedTasks = this.taskService.paginatedTasks();

    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    return paginatedTasks.map((task) => {
      const user = userMap.get(task.userId);

      return {
        ...task,
        ...user,
      } as UserTask;
    });
  });

  pagination = computed(() => this.taskService.pageMeta());
  onNext() {
    this.taskService.nextPage();
  }
  onPrev() {
    this.taskService.prevPage();
  }
  goToPage(page: number) {
    this.taskService.currentPage.set(page);
  }
  sortByFieldHandler(field: keyof Task) {
    this.taskService.sortByField(field, this.isDescending ? 'desc' : 'asc');
    this.sortDescending();
  }
  sortDescending() {
    this.isDescending = !this.isDescending;
  }
  isPastDue(dueDate: Date, isComplete: boolean): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isComplete ? false : dueDate < today;
  }
}
