import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor';
import { combineLatest } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css']
})
export class BookAppointment implements OnInit {

  doctors: any[] = [];
  filteredDoctorsList: any[] = [];

  role: string | null = null;

  searchTerm: string = '';
  sortBy: string = '';
  availableToday: boolean = false;

  selectedSpecialization: string | null = null;
  cameFromCheckup: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

 ngOnInit(): void {

  this.role = localStorage.getItem('role');

  const doctors$ = this.doctorService.getAllDoctors();
  const params$ = this.route.queryParams;

  combineLatest([doctors$, params$]).subscribe(([doctors, params]) => {

    console.log("Doctors from API:", doctors);

    this.doctors = doctors;
    this.selectedSpecialization = params['specialization'] || null;
    this.cameFromCheckup = !!params['specialization'];

    this.applyFilters();
    this.cd.detectChanges();   
  });

}

  applyFilters() {

    let filtered = [...this.doctors];

    // Specialization filter (only if selected)
    if (this.selectedSpecialization) {
      filtered = filtered.filter(doc =>
        doc.specialization?.toLowerCase() ===
        this.selectedSpecialization?.toLowerCase()
      );
    }

    // Search
    if (this.searchTerm.trim() !== '') {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Available Today
    if (this.availableToday) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      filtered = filtered.filter(doc =>
        doc.availableDays?.includes(today)
      );
    }

    // Sorting
    if (this.sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    }

    if (this.sortBy === 'fee') {
      filtered.sort((a, b) => a.consultationFee - b.consultationFee);
    }

    this.filteredDoctorsList = filtered;
  }

  // 🔥 SEE ALL button
  showAllDoctors() {
    this.selectedSpecialization = null;
    this.cameFromCheckup = false;

    // remove query param from URL
    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true
    });

    this.applyFilters();
  }
}