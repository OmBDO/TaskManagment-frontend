import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile-option',
  templateUrl: 'profile.option.html',
  styleUrl: 'profile.option.css',
  imports: [CommonModule],
})
export class ProfileOptionComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  options = [
    { label: 'Profile', action: 'profile', icon: '../../../assets/image/icons/user-circle.svg' },
    {
      label: 'Logout',
      action: 'logout',
      icon: '../../../assets/image/icons/logout.svg',
    },
  ];
  isProfileOption = false;

  onOptionSelect(action: any) {
    if (action == 'logout') {
      this.onLogout();
    } else if (action == 'profile') {
      console.log('profile');
      this.onProfile();
    }
  }
  onProfile() {
    const userId = this.authService.authUser()?.id ?? '';
    this.router.navigate(['/users', userId]);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  onProfileClick() {
    this.isProfileOption = true;
  }
}
