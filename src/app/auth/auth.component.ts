import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'; // 1. Import ReactiveFormsModule
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginUser, RegisterUser } from '../users/user.model';
import { AuthUser } from './auth-user.model';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 2. Add ReactiveFormsModule here
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private route = inject(Router);
  private authService = inject(AuthService);
  registerSumbitted = false;
  loginSugmitted = false;
  isLoading = signal<boolean>(false);
  isLoginMode = signal(true);
  isError = signal<string>('');

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registerForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
  });

  toggleMode() {
    this.isLoginMode.update((mode) => !mode);
  }

  onLoginSubmit() {
    this.loginSugmitted = true;

    if (this.loginForm.valid) {
      const credentials: LoginUser = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.isLoading.set(true);
      this.authService.login(credentials).subscribe({
        next: (__) => {
          this.loginSugmitted = false;
          this.isLoading.set(false);
          this.route.navigate(['/home']);
        },
        error: (err: string) => {
          console.log(err);
          this.isError.set(err);
          setTimeout(() => {
            this.isError.set('');
          }, 2400);
          this.isLoading.set(false);
        },
      });
    }
  }

  onRegisterSubmit() {
    this.registerSumbitted = true;
    this.isLoading.set(true);
    if (this.registerForm.valid) {
      const credentials: RegisterUser = {
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        firstName: this.registerForm.value.firstname!,
        lastName: this.registerForm.value.lastname!,
        role: this.registerForm.value.role?.toLowerCase() ?? 'User',
      };

      console.log(credentials);

      this.authService.register(credentials).subscribe({
        next: (_) => {
          this.registerSumbitted = false;
          this.route.navigate(['/auth']);
          this.isLoginMode.update((old) => true);
          this.isLoading.set(false);
        },
        error: (err: string) => {
          console.log(err);
          this.isError.set(err);
          setTimeout(() => {
            this.isError.set('');
          }, 2400);
          this.isLoading.set(false);
        },
      });
    }
  }
}
