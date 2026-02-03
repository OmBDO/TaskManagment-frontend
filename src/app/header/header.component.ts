import { Component, computed, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { ProfileOptionComponent } from './profile-option/profile.option';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { UserRole } from '../../core/enums/Role';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [ProfileOptionComponent, CommonModule, FormsModule, RouterLink],

  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private elementRef = inject(ElementRef);
  private router = inject(Router);

  navItems: { label: string; link: string }[] = [
    { label: 'Tasks', link: '/home/task' },
    { label: 'Users', link: '/home/users' },
    { label: 'Create User', link: '/home/createUser' },
  ];
  isProfileOption = false;
  activeItem = this.navItems[0];
  role: string[] = [];

  constructor() {
    if (this.userService.currentUser().id == '') {
      const authId = this.authService.authUser()?.id ?? '';
      this.userService.getUserDetailAsync(authId);
    }
    this.role = this.authService.authUser()?.roles ?? [];
    if (!this.role.includes(UserRole.Administrator)) {
      this.navItems.pop();
      this.navItems.pop();
    }
  }
  ngOnInit(): void {
    this.updateActiveItem(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveItem(event.urlAfterRedirects);
      });
  }

  private updateActiveItem(url: string) {
    if (url.includes('createUser')) {
      this.activeItem = this.navItems[2];
    } else if (url.includes('users')) {
      this.activeItem = this.navItems[1];
    } else if (url.includes('task')) {
      this.activeItem = this.navItems[0];
    }
  }
  currentUser = computed(() => {
    return this.userService.currentUser;
  });

  setActive(item: { label: string; link: string }) {
    this.activeItem = item;
  }
  onProfileClick(event: Event) {
    event.stopPropagation();
    this.isProfileOption = true;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isProfileOption = false;
    }
  }
}
