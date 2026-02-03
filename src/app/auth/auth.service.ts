import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { timer, Subscription, takeWhile, tap, finalize, catchError, throwError } from 'rxjs';
import { AppConstant } from '../../core/constant/app_constants';
import { TaskServices } from '../tasks/tasks.service';
import { AuthUser } from './auth-user.model';
import { LoginUser, RegisteredUser, RegisterUser } from '../users/user.model';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private taskService = inject(TaskServices);
  private userService = inject(UserService);

  private readonly SESSION_TIME_SECONDS = 600;

  authUser = signal<AuthUser | null>(this.getStoredUser());
  logoutCountdown = signal<number | null>(null);
  private timerSub: Subscription | null = null;

  constructor() {
    this.resumeTimer();
  }

  login(credentials: LoginUser) {
    return this.http.post<AuthUser>(AppConstant.login, credentials).pipe(
      tap((res) => {
        const expiryTime = Date.now() + this.SESSION_TIME_SECONDS * 1000;

        localStorage.setItem('token', res.tokenKey);
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('sessionExpiry', expiryTime.toString());

        this.authUser.set(res);
        this.startLogoutTimer(this.SESSION_TIME_SECONDS);
      }),
    );
  }

  private resumeTimer() {
    const expiry = localStorage.getItem('sessionExpiry');
    if (expiry && this.authUser()) {
      const remainingSeconds = Math.floor((Number(expiry) - Date.now()) / 1000);

      if (remainingSeconds > 0) {
        this.startLogoutTimer(remainingSeconds);
      } else {
        this.logout();
      }
    }
  }

  startLogoutTimer(seconds: number) {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.logoutCountdown.set(seconds);

    this.timerSub = timer(0, 1000)
      .pipe(
        tap(() => {
          const current = this.logoutCountdown();
          if (current !== null && current > 0) {
            this.logoutCountdown.set(current - 1);
          }
        }),
        takeWhile(() => (this.logoutCountdown() ?? 0) > 0),
        finalize(() => {
          if (this.logoutCountdown() === 0) {
            this.logout();
            this.router.navigate(['/auth']);
          }
        }),
      )
      .subscribe();
  }

  logout() {
    this.taskService.removeLogoutTask();
    if (this.timerSub) this.timerSub.unsubscribe();

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');

    this.authUser.set(null);
    this.logoutCountdown.set(null);
    this.userService.removeCurrentUser();
  }

  private getStoredUser(): AuthUser | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  register(credential: RegisterUser) {
    return this.http.post<RegisteredUser>(AppConstant.register, credential);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
