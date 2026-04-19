import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment';
import { CommonModule } from '@angular/common';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.css']
})
export class AdminAppointments implements OnInit, OnDestroy {

  appointments: any[] = [];
  filteredAppointments: any[] = [];

  refreshSub!: Subscription;
  loading = true;

  statusFilter: string = '';
  selectedDate: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    // auto refresh
    this.refreshSub = timer(0, 3000)
      .pipe(
        switchMap(() => this.appointmentService.getAllAppointments())
      )
      .subscribe({
        next: (data: any) => {

          this.appointments = [...data];
          this.applyFilters();

          this.loading = false;
          this.cdr.detectChanges();

        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });

  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  applyFilters() {

    let data = [...this.appointments];

    if (this.statusFilter) {
      data = data.filter(a => a.status === this.statusFilter);
    }

    if (this.selectedDate) {
      data = data.filter(a =>
        a.appointmentDate.startsWith(this.selectedDate)
      );
    }

    this.filteredAppointments = data;

    this.cdr.detectChanges();
  }

  clearFilters() {

    this.statusFilter = '';
    this.selectedDate = '';

    this.filteredAppointments = [...this.appointments];

    this.cdr.detectChanges();
  }

  updateStatus(id: string, status: string) {

    this.appointmentService.updateStatus(id, status)
      .subscribe({
        next: () => {

          const index = this.appointments.findIndex(a => a._id === id);

          if (index !== -1) {
            this.appointments[index].status = status;
          }

          this.applyFilters();
          this.cdr.detectChanges();

        },
        error: err => {

          console.error(err);

          if (err.error?.message) {
            alert(err.error.message);   // 🔥 SHOW BACKEND MESSAGE
          } else {
            alert("Something went wrong");
          }

        }
      });

  }
  isFuture(appt: any): boolean {

  const now = new Date();

  const apptDateTime = new Date(
    new Date(appt.appointmentDate).toISOString().split('T')[0] +
    'T' +
    appt.appointmentTime
  );

  return now < apptDateTime;
}

}