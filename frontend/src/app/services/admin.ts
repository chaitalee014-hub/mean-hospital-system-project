import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  createDoctor(data: any) {
    const token = localStorage.getItem('token');

    return this.http.post(
      `${this.apiUrl}/create-doctor`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}