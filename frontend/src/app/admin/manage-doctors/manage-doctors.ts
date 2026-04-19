import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './manage-doctors.html',
  styleUrl: './manage-doctors.css'
})
export class ManageDoctors implements OnInit {

  doctors: any[] = [];
  filteredDoctors: any[] = [];

  searchTerm: string = '';
  specializationFilter: string = '';
  today: string = new Date().toISOString().split('T')[0];

  loading = true;

  API = "http://localhost:5000/api/doctors";
  ADMIN_API = "http://localhost:5000/api/doctor";
  AVAIL_API = "http://localhost:5000/api/doctors/availability";

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  /* ==========================
      LOAD DOCTORS
  ========================== */

  loadDoctors() {

    this.loading = true;

    this.http.get<any[]>(this.API).subscribe({
      next: (data) => {

        this.doctors = [...data];
        this.filteredDoctors = [...data];

        this.loading = false;

        this.cd.detectChanges();

      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cd.detectChanges();
      }
    });

  }

  /* ==========================
      FILTERS
  ========================== */

  applyFilters() {

    let data = [...this.doctors];

    if (this.searchTerm) {
      data = data.filter(d =>
        d.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.specializationFilter) {
      data = data.filter(d =>
        d.specialization === this.specializationFilter
      );
    }

    this.filteredDoctors = data;

    this.cd.detectChanges();

  }

  clearFilters() {

    this.searchTerm = '';
    this.specializationFilter = '';

    this.filteredDoctors = [...this.doctors];

    this.cd.detectChanges();

  }

  /* ==========================
      DELETE DOCTOR
  ========================== */

  deleteDoctor(id: string) {

    if (!confirm("Delete this doctor?")) return;

    this.http.delete(`${this.ADMIN_API}/${id}`)
      .subscribe({
        next: () => {

          this.doctors = this.doctors.filter(d => d._id !== id);

          this.applyFilters();

          this.cd.detectChanges();

        },
        error: (err) => console.error(err)
      });

  }

  /* ==========================
      UPDATE DOCTOR (NAVIGATE)
  ========================== */

  editDoctor(id: string) {

    this.router.navigate(['/admin/edit-doctor', id]);

  }
  /* ==========================
   TOGGLE AVAILABILITY
========================== */
toggleAvailability(doctor: any) {

  const newStatus = !doctor.isAvailable;

  const payload = {
    doctorId: doctor._id,
    isAvailable: doctor.isAvailable
  };

  this.http.put(this.AVAIL_API, payload)
    .subscribe({
      next: () => {
      },
      error: (err) => {
        console.error(err);
        alert("Failed to update status");
         doctor.isAvailable = !doctor.isAvailable;
      }
    });
}

/* ==========================
   ADD LEAVE DATE
========================== */
addLeaveDate(doctor: any, event: any) {

  const selectedDate = event.target.value;

  if (!selectedDate) return;

  // ❌ BLOCK invalid leave (non-working day)
  if (!this.isValidLeaveDay(doctor, selectedDate)) {
    alert("Doctor is already not available on this day");
    return;
  }

  if (doctor.leaveDates?.includes(selectedDate)) {
    alert("Date already added");
    return;
  }

  const updatedDates = [...(doctor.leaveDates || []), selectedDate];

  const payload = {
    doctorId: doctor._id,
    leaveDates: updatedDates
  };

  this.http.put(this.AVAIL_API, payload)
    .subscribe({
      next: () => {
        doctor.leaveDates = updatedDates;
      },
      error: (err) => {
        console.error(err);
        alert("Failed to add leave");
      }
    });
}

// 🔥 TODAY CHECK
isOnLeaveToday(doctor: any): boolean {
  return doctor.leaveDates?.includes(this.today);
}

// 🔥 ONLY FUTURE LEAVES (CLEAN)
getUpcomingLeaves(doctor: any) {
  return (doctor.leaveDates || [])
    .filter((d: string) => d >= this.today)
    .sort(); // sorted dates
}

isValidLeaveDay(doctor: any, date: string): boolean {

  const dayName = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long'
  });

  return doctor.availableDays?.includes(dayName);
}
}