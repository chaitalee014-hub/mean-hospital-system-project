import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  bookAppointment() {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/book-appointment']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { message: 'Please login first to book appointment' }
      });
    }

  }
}

