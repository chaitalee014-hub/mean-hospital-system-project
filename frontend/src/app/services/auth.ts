import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";
import { app } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api'; // directly here

  constructor(private http: HttpClient, private router: Router) { }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  isDoctor(): boolean {
    return localStorage.getItem('role') === 'doctor';
  }

  isUser(): boolean {
    return localStorage.getItem('role') === 'patient';
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  logout() {
  const auth = getAuth(app);

  // 🔥 Firebase logout (for Google login)
  signOut(auth).then(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');

    this.router.navigate(['/login']);
  }).catch(() => {
    // fallback (normal login case)
    localStorage.clear();
    this.router.navigate(['/login']);
  });
}
  
}
