import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkup.html',
  styleUrls: ['./checkup.css']
})
export class Checkup implements OnInit {

  role: string | null = null;

  // 🔹 Health Packages
  packages = [
    { name: 'Women Health Checkup', specialization: 'Gynecologist', icon: '👩‍⚕️', description: 'Comprehensive women wellness screening' },
    { name: 'Diabetes Checkup', specialization: 'Endocrinologist', icon: '🩸', description: 'Blood sugar & metabolic health assessment' },
    { name: 'Cancer Screening', specialization: 'Oncologist', icon: '🧬', description: 'Early detection & preventive testing' },
    { name: 'Full Body Checkup', specialization: 'General Physician', icon: '🩺', description: 'Complete body health examination' },
    { name: 'Heart Checkup', specialization: 'Cardiologist', icon: '❤️', description: 'Cardiac risk evaluation & ECG tests' },
    { name: 'Brain Checkup', specialization: 'Neurologist', icon: '🧠',  description: 'Neurological examination & brain health assessment' },
    { name: 'Kid Health Checkup', specialization: 'Pediatrician', icon: '👶', description: 'Child growth & immunity check' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }

  // 🔹 Navigate with specialization filter
  findSpecialist(specialization: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/book-appointment'], {
        queryParams: { specialization }
      });
    } else {
      this.router.navigate(['/login'], {
        queryParams: { message: 'Please login first to book appointment' }
      });
    }
  }
}