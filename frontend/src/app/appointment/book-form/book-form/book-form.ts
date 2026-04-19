import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {

  doctorId!: string;
  doctor: any;

  minDate: string = '';
  maxDate: string = '';
  timeSlots: string[] = [];

  errorMessage: string = '';

  form = {
    appointmentDate: '',
    appointmentTime: ''
  };

  constructor(
    private route: ActivatedRoute,
    private api: AppointmentService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.doctorId = this.route.snapshot.paramMap.get('id')!;

    const today = new Date();

    // Minimum date = today
    this.minDate = today.toISOString().split('T')[0];

    // Maximum date = today + 2 months
    const max = new Date();
    max.setMonth(max.getMonth() + 2);

    this.maxDate = max.toISOString().split('T')[0];
    this.loadDoctor();
  }

  loadDoctor() {

    this.api.getDoctorById(this.doctorId).subscribe((res: any) => {

      this.doctor = res;

      // trigger UI update
      this.cd.detectChanges();

    });

  }
generateSlots() {

  this.timeSlots = [];
  this.errorMessage = '';

  if (!this.doctor || !this.form.appointmentDate) return;

  // 🔥 FORMAT DATE FIRST
  const formattedDate = new Date(this.form.appointmentDate)
    .toISOString()
    .split("T")[0];

  // 🔴 BLOCK FULL OFF
  if (!this.doctor.isAvailable) {
    this.errorMessage = "Doctor is not available currently";
    return;
  }

  // 🔴 BLOCK LEAVE DATE
  if (this.doctor.leaveDates?.includes(formattedDate)) {
    this.errorMessage = "Doctor is on leave on this date";
    return;
  }

  const selectedDate = new Date(this.form.appointmentDate);

  const selectedDay =
    selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

  const availableDays = this.doctor.availableDays.map(
    (d: string) => d.toLowerCase()
  );

  // ❌ doctor not available on that weekday
  if (!availableDays.includes(selectedDay.toLowerCase())) {

    this.errorMessage =
      `Doctor not available on ${selectedDay}. Available days: ${this.doctor.availableDays.join(', ')}`;

    return;
  }

  const [startH, startM] = this.doctor.startTime.split(':').map(Number);
  const [endH, endM] = this.doctor.endTime.split(':').map(Number);
  const [lunchH, lunchM] = this.doctor.lunchStart.split(':').map(Number);
  const [lunchEH, lunchEM] = this.doctor.lunchEnd.split(':').map(Number);

  let start = startH * 60 + startM;
  const end = endH * 60 + endM;

  const lunchStart = lunchH * 60 + lunchM;
  const lunchEnd = lunchEH * 60 + lunchEM;

  const now = new Date();
  const todayString = now.toISOString().split('T')[0];

  while (start < end) {

    // skip lunch
    if (start >= lunchStart && start < lunchEnd) {
      start += this.doctor.slotDuration;
      continue;
    }

    // skip past time if today
    if (this.form.appointmentDate === todayString) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      if (start <= currentMinutes) {
        start += this.doctor.slotDuration;
        continue;
      }
    }

    const hour = Math.floor(start / 60).toString().padStart(2, '0');
    const minute = (start % 60).toString().padStart(2, '0');

    this.timeSlots.push(`${hour}:${minute}`);

    start += this.doctor.slotDuration;
  }

  // 🔥 IMPORTANT: use formattedDate here too
  this.api
    .getBookedSlots(this.doctorId, formattedDate)
    .subscribe((booked: any) => {

      this.timeSlots =
        this.timeSlots.filter(slot => !booked.includes(slot));

      this.cd.detectChanges();
    });
}
  
submit() {

  if (!this.form.appointmentDate || !this.form.appointmentTime) {
    alert("Please select date and time");
    return;
  }

  const formattedDate = new Date(this.form.appointmentDate)
    .toISOString()
    .split("T")[0];

  // 🔴 BLOCK LEAVE DATE
  if (this.doctor.leaveDates?.includes(formattedDate)) {
    alert("Doctor is on leave on this date");
    return;
  }

  // 🔴 BLOCK FULL OFF
  if (!this.doctor.isAvailable) {
    alert("Doctor is not available");
    return;
  }

  const payload = {
    appointmentDate: formattedDate,
    appointmentTime: this.form.appointmentTime
  };

  this.api
    .bookAppointment(this.doctorId, payload)
    .subscribe({

      next: (res: any) => {
        alert(res.message);
        this.form.appointmentTime = '';
        this.generateSlots();
      },

      error: (err: any) => {
        alert(err.error?.message || 'Booking failed');
      }
    });
}
}