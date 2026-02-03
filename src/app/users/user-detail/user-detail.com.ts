import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.com.html',
  styleUrl: './user-detail.com.css',
})
export class UserDetailComponent {
  id = signal<string>('');
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  role = computed(() => this.authService.authUser()?.roles[0] ?? []);

  onNavigateBack() {
    this.router.navigate(['/home/tasks']);
  }
}
