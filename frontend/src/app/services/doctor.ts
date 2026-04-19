import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class DoctorService {

 private API = `${environment.apiUrl}/doctors`;// backend route

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.API);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.API}/${id}`);
  }
}
