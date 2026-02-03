import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AppConstant } from '../../core/constant/app_constants';
import { RegisteredUser, RegisterUser, User } from './user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from '../tasks/task.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private disposeRef = inject(DestroyRef);
  usersDetail = signal<User[]>([]);
  usersTask = signal<Task[]>([]);
  currentUser = signal<User>({ email: '', id: '', firstName: '', lastName: '' });

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
      .get<User[]>(AppConstant.getUsersDetail)
      .pipe(takeUntilDestroyed(this.disposeRef))

      .subscribe({
        next: (users) => this.usersDetail.set(users),
        error: (err) => console.error('Failed to load users', err),
      });
  }

  getSelectedUserDetail(userId: string) {
    if (this.usersDetail().length == 0) {
      this.usersDetailAsync();
    }

    return this.usersDetail().find((user) => user.id === userId);
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
    this.currentUser.set({ email: '', id: '', firstName: '', lastName: '' });
  }
}
