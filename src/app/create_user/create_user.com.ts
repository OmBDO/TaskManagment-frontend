import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterUser } from '../users/user.model';
import { AuthService } from '../auth/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create_user.com.html',
  styleUrl: './create_user.com.css',
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  isLoading: boolean = false;
  onError = signal<{ isError: boolean; error: string }>({ isError: false, error: '' });
  showSuccess = signal<boolean>(false);
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  roles = ['User', 'Administrator'];

  userForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      re_password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      const newUser = this.userForm.value as RegisterUser;
      this.userService.createUserAsync(newUser).subscribe({
        next: (res) => {
          this.userService.usersDetail.update((old) => [
            ...old,
            {
              id: res.id,
              email: res.email,
              firstName: res.firstName,
              lastName: res.lastName,
              roles: res.role,
              task: null,
            },
          ]);
          this.onRegisterDoneDialog();
        },
        error: (errorMessage: string) => {
          this.isLoading = false;
          this.onError.set({
            error: errorMessage,
            isError: true,
          });
          setTimeout(() => {
            this.onError.set({
              error: errorMessage,
              isError: false,
            });
          }, 2500);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  onRegisterDoneDialog() {
    this.showSuccess.set(true);

    setTimeout(() => {
      this.showSuccess.set(false);
      this.onReset();
      this.router.navigate(['home/tasks']);
    }, 2500);
  }

  onReset() {
    this.userForm.reset({ role: '' });
  }
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const re_password = control.get('re_password');

  if (!re_password?.value || password?.value === re_password?.value) {
    return null;
  }

  return { passwordMismatch: true };
};
