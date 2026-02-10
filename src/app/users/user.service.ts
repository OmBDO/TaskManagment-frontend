import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AppConstant } from '../../core/constant/app_constants';
import { RegisteredUser, RegisterUser, User, UserTask } from './user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from '../tasks/task.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private disposeRef = inject(DestroyRef);
  usersDetail = signal<UserTask[]>([]);
  usersTask = signal<Task[]>([]);
  currentUser = signal<User>({ email: '', id: '', firstName: '', lastName: '', roles: 'User' });

  getUserDetailAsync(userId: string) {
    this.httpClient
      .get<User>(AppConstant.getUserDetail(userId))
      .pipe(takeUntilDestroyed(this.disposeRef))
      .subscribe({
        next: (user) => this.currentUser.set(user),
        error: (err) => console.error('Failed to load users', err),
      });
  }

  usersDetailAsync() {
    if (this.usersDetail().length > 0) {
      return;
    }
    this.httpClient
      .get<UserTask[]>(AppConstant.getUsersDetail)

      .pipe(takeUntilDestroyed(this.disposeRef))

      .subscribe({
        next: (users) => this.usersDetail.set(users),
        error: (err) => console.error('Failed to load users', err),
      });
  }

  patchLoclTskOnUsrPage(userId: string, taskId: number, updatedTaskData: Task) {
    this.usersDetail.update((users) =>
      users.map((user) => {
        if (user.id === userId && user.task?.taskId === taskId) {
          return {
            ...user,
            task: { ...updatedTaskData, taskId: taskId },
          };
        }
        return user;
      }),
    );
  }

  getSelectedUserDetail(userId: string) {
    if (this.usersDetail().length == 0) {
      this.usersDetailAsync();
    }
    const user = this.usersDetail().find((user) => user.id === userId);
    if (user == null) return null;
    return user;
  }

  createUserAsync(credential: RegisterUser) {
    return this.httpClient
      .post<RegisteredUser>(AppConstant.postUser, credential)
      .pipe(takeUntilDestroyed(this.disposeRef));
  }

  getUserTaskAsync(userId: string) {
    this.httpClient
      .get<Task[]>(AppConstant.getUserTasks(userId))
      .pipe(takeUntilDestroyed(this.disposeRef))
      .subscribe({
        next: (res) => {
          this.usersTask.set(res);
        },
      });
  }

  removeCurrentUser() {
    this.currentUser.set({ email: '', id: '', firstName: '', lastName: '', roles: '' });
  }
}
