import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(private router: Router, private http: HttpClient) { }

  signup() {
    if (!this.name.trim() || !this.email.trim() || !this.password) {
      alert("All fields are required");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.http.post<any>(`${environment.apiUrl}/auth/signup`, payload)
      .subscribe({
        next: () => {
          alert("Signup successful!");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.error?.message || "Signup failed");
        }
      });
  }

}