import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment';

@Component({
  selector: 'app-edit-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-doctor.html',
  styleUrl: './edit-doctor.css'
})
export class EditDoctor implements OnInit {

  doctorId!: string;
  loading = true;
  errorMessage: string = "";

  API = environment.apiUrl + "/api/doctors";
  ADMIN_API = environment.apiUrl + "/api/admin/doctor";

  doctor: any = {
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    startTime: '',
    endTime: '',
    lunchStart: '',
    lunchEnd: '',
    slotDuration: 30,
    availableDays: []
  };

  selectedImage: File | null = null;

  days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.doctorId = this.route.snapshot.paramMap.get('id')!;

    this.http.get<any>(`${this.API}/${this.doctorId}`)
      .subscribe({
        next: (data) => {
          this.doctor = data;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: err => {
          console.error(err);
          this.errorMessage = "Failed to load doctor data";
        }
      });
  }

  toggleDay(day: string) {
    const index = this.doctor.availableDays.indexOf(day);

    if (index > -1) {
      this.doctor.availableDays.splice(index, 1);
    } else {
      this.doctor.availableDays.push(day);
    }
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  updateDoctor() {

    this.errorMessage = "";

    const formData = new FormData();

    Object.keys(this.doctor).forEach(key => {
      if (key === 'availableDays') {
        this.doctor.availableDays.forEach((d: any) => formData.append('availableDays', d));
      } else {
        formData.append(key, this.doctor[key]);
      }
    });

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
      console.log("Selected image:", this.selectedImage);
    }

    // 🔥 ADD TOKEN
    const token = localStorage.getItem("token");

    this.http.put(
      `${this.ADMIN_API}/${this.doctorId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`   // ✅ IMPORTANT
        }
      }
    )
      .subscribe({
        next: () => {
          alert("Doctor updated successfully");
          this.router.navigate(['/admin/doctors']);
        },
        error: err => {
          console.log("Full error:", err);
          this.errorMessage = err.error?.message || "Something went wrong";
        }
      });
  }
}