import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment';
import { CommonModule } from '@angular/common';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-appointments.html',
  styleUrls: ['./doctor-appointments.css']
})
export class DoctorAppointment implements OnInit, OnDestroy {

  appointments: any[] = [];
  filteredAppointments: any[] = [];

  refreshSub!: Subscription;
  notificationSub!: Subscription;   // ✅ NEW

  loading = true;

  statusFilter: string = '';
  selectedDate: string = '';

  // 🔔 Notification
  notificationCount = 0;
  previousCount = 0;

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    // ✅ APPOINTMENT POLLING (unchanged)
    this.refreshSub = timer(0, 3000)
      .pipe(
        switchMap(() => this.appointmentService.getDoctorAppointments())
      )
      .subscribe({
        next: (data: any[]) => {
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

    // ✅ NOTIFICATION POLLING (FIXED)
    this.notificationSub = timer(0, 3000).subscribe(() => {
      this.loadNotificationCount();
    });
  }

  // 🔔 GET COUNT
  loadNotificationCount() {
    this.appointmentService.getUnseenCount()
      .subscribe((res: any) => {

        this.notificationCount = res.count;

        // 🔊 Play sound only when count increases
        if (this.notificationCount > this.previousCount) {
          this.playSound();
        }

        this.previousCount = this.notificationCount;
        this.cdr.detectChanges();
      });
  }

  // 🔔 CLICK BELL (FIXED - TRUST BACKEND)
  onBellClick() {
    this.appointmentService.markAllSeen().subscribe({
      next: () => {
        this.loadNotificationCount();   // ✅ correct
      },
      error: (err) => {
        console.error("MARK SEEN ERROR:", err);
      }
    });
  }

  // 🔊 SOUND
  playSound() {
    try {
      const audio = new Audio();
      audio.src = 'assets/notification.mp3';
      audio.load();
      audio.play().catch(() => { });
    } catch { }
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.notificationSub) this.notificationSub.unsubscribe(); // ✅ FIX
  }

  // 🔎 FILTER
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

  // 🔄 UPDATE STATUS
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