import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-doctor.html',
  styleUrls: ['./add-doctor.css']
})
export class AddDoctor {
  doctor: any = {};

  constructor(private adminService: AdminService) { }

  selectedFile!: File;

  createDoctor() {

    const formData = new FormData();

    formData.append("name", this.doctor.name);
    formData.append("email", this.doctor.email);
    formData.append("specialization", this.doctor.specialization);
    formData.append("qualification", this.doctor.qualification);
    formData.append("experience", this.doctor.experience);
    formData.append("consultationFee", this.doctor.consultationFee);
    formData.append("hospitalId", this.doctor.hospitalId);
    formData.append("startTime", this.doctor.startTime);
    formData.append("endTime", this.doctor.endTime);
    formData.append("lunchStart", this.doctor.lunchStart);
    formData.append("lunchEnd", this.doctor.lunchEnd);
    formData.append("slotDuration", this.doctor.slotDuration || 30);
    if (this.doctor.availableDays) {
      const days = this.doctor.availableDays.split(',').map((d: string) => d.trim());
      days.forEach((day: string) => formData.append("availableDays", day));
    }

    if (this.selectedFile) {
      formData.append("image", this.selectedFile);
    }

    this.adminService.createDoctor(formData).subscribe({
      next: () => {
        alert("Doctor Created Successfully");
        this.doctor = {};
      },
      error: (err) => {
        alert(err.error?.message || "Error");
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }
}