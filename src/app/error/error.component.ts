import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-error',
  templateUrl: 'error.component.html',
  styleUrl: 'error.component.css',
})
export class ErrorComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  message = input<String>('');
  status = input<number>(0);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['auth']);
      this.authService.logout();
    }, 2300);
  }
}
