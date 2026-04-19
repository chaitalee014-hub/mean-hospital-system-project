import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment';
import { interval, Subscription, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './patient.html',
  styleUrls: ['./patient.css']
})
export class Patient implements OnInit, OnDestroy {

  appointments: any[] = [];
  loading = true;
  errorMessage = '';
  refreshSub!: Subscription;

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAppointments();

    // Auto refresh every 10 seconds
    this.refreshSub = interval(10000)
      .pipe(switchMap(() => this.appointmentService.getMyAppointments()))
      .subscribe((res: any) => {
        this.appointments = [...(res || [])]; // 🔥 new reference
        this.cdr.detectChanges(); // 🔥 force UI update
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  loadAppointments() {
    this.loading = true;

    this.appointmentService.getMyAppointments().subscribe({
      next: (res: any) => {
        this.appointments = [...(res || [])]; // 🔥 new reference
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 force refresh
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load appointments';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔥 NEW: Cancel appointment
  cancelAppointment(id: string) {
    this.appointmentService.updateStatus(id, 'cancelled_by_patient')
      .subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Cancel failed';
        }
      });
  }
}