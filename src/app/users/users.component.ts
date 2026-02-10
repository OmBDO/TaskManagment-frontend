import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskServices } from '../tasks/tasks.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Priority, Task } from '../tasks/task.model';
import { UserRole } from '../../core/enums/Role';
import { UserService } from './user.service';
import { User, UserTask } from './user.model';
import { UserTaskHeaderComponet } from './user-task-header/user-task-header.component';
import { Router } from '@angular/router';
import { RelativeDatePipe } from '../pipes/relativeDate.pip';

@Component({
  selector: 'app-users',

  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css', '../tasks/tasks.component.css'],
  imports: [UserTaskHeaderComponet, CommonModule, RelativeDatePipe],
})
export class UsersComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  currentUser = this.authService.authUser;
  searchQuery = signal<string>('');
  PriorityEnum = Priority;
  RoleEnum = UserRole;
  isDescending = false;
  ngOnInit(): void {
    this.userService.usersDetailAsync();
    console.log(this.userService.usersDetail());
  }

  usersWithTopTask = computed(() => {
    console.log(this.userService.usersDetail());
    return this.userService.usersDetail();
  });

  private filterUsersByRole(role: string) {
    const query = this.searchQuery();
    return this.usersWithTopTask().filter((user) => {
      const matchesRole = user.roles === role;
      const matchesSearch =
        !query ||
        ['firstName', 'lastName', 'email'].some((key) =>
          user[key as keyof User]?.toLowerCase().includes(query),
        );
      return matchesRole && matchesSearch;
    });
  }

  AdminUsers = computed(() => this.filterUsersByRole(this.RoleEnum.Administrator.toString()));
  NormUsers = computed(() => this.filterUsersByRole(this.RoleEnum.User.toString()));

  isPastDue(dueDate: Date, isComplete: boolean): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isComplete ? false : dueDate < today;
  }

  onSearch(value: string) {
    console.log(value);
    this.searchQuery.set(value.toLowerCase());
  }
  onSelectedUser(userId: string) {
    console.log(userId);
    this.router.navigate(['home', 'users', userId, 'tasks']);
  }
}
