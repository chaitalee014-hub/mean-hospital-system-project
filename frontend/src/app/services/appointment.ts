import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private API = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Doctor
getDoctorAppointments() {
  return this.http.get<any[]>(
    `${this.API}/doctor?ts=${Date.now()}`,
    this.getAuthHeaders()
  );
}


  updateStatus(id: string, status: string) {
    return this.http.put(`${this.API}/${id}`, { status }, this.getAuthHeaders());
  }

  // Patient
  getMyAppointments() {
    return this.http.get(`${this.API}/my`, this.getAuthHeaders());
  }

  // Admin
  getAllAppointments() {
    return this.http.get(`${this.API}/all`, this.getAuthHeaders());
  }

  // Book
  bookAppointment(doctorId: string, formData: any) {
    return this.http.post(
      `${this.API}/book/${doctorId}`,
      formData,
      this.getAuthHeaders()
    );
  }

  getDoctorById(id: string) {
  return this.http.get(`http://localhost:5000/api/doctors/${id}`);
}

getBookedSlots(doctorId: string, date: string) {
  return this.http.get(
    `${this.API}/booked-slots?doctorId=${doctorId}&date=${date}`,
    this.getAuthHeaders()
  );
}

getUnseenCount() {
  return this.http.get<any>(
    `${this.API}/unseen-count`,
    this.getAuthHeaders()
  );
}

markAllSeen() {
  return this.http.put(
    `${this.API}/mark-seen`,
    {},
    this.getAuthHeaders()
  );
}

}