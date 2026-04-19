import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../../firebase';
import { environment } from '../../../environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: '/login.css'
})
export class Login implements OnInit {

  email: string = '';
  password: string = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(private router: Router, private http: HttpClient) { }

  // 🔥 Auto redirect if already logged in
  ngOnInit() {
    const existingToken = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (existingToken) {
      if (role === "admin") {
        this.router.navigate(['/admin-dashboard']);
      }
      else if (role === "doctor") {
        this.router.navigate(['/doctor-dashboard']);
      }
      else {
        this.router.navigate(['/book-appointment']);
      }
    }
  }
  login() {

    const payload = {
      email: this.email.trim(),
      password: this.password
    };

    this.http.post<any>(`${environment.apiUrl}/auth/login`, payload)
      .subscribe({
        next: (res) => {

          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.userId);
          localStorage.setItem("name", res.name);

          if (res.role === "admin") {
            this.router.navigate(['/admin-dashboard']);
          }
          else if (res.role === "doctor") {
            this.router.navigate(['/doctor-dashboard']);
          }
          else {
            this.router.navigate(['/book-appointment']);
          }
        },
        error: (err) => {
          alert(err.error?.message || "Login failed");
        }
      });
  }
  googleLogin() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account'
  });

  signInWithPopup(auth, provider)
    .then((result) => {

      const user = result.user;

      // 🔥 Send to backend
      this.http.post<any>(`${environment.apiUrl}/auth/google`, {
        name: user.displayName,
        email: user.email
      }).subscribe({
        next: (res) => {

          // ✅ Save same as normal login
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('name', res.name);

          // ✅ Redirect same logic
          if (res.role === "admin") {
            this.router.navigate(['/admin-dashboard']);
          }
          else if (res.role === "doctor") {
            this.router.navigate(['/doctor-dashboard']);
          }
          else {
            this.router.navigate(['/book-appointment']);
          }
        },
        error: () => {
          alert("Backend error in Google login");
        }
      });

    })
    .catch((error) => {
      console.error(error);
      alert("Google login failed");
    });
}
}
