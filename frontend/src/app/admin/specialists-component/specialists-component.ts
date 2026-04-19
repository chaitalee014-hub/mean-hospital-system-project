import { Component, OnInit } from '@angular/core';
import { SpecialistService } from '../../services/specialist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './specialists-component.html',
  styleUrls: ['./specialists-component.css']
})
export class SpecialistsComponent implements OnInit {

  specialists: any[] = [];

  constructor(
    private service: SpecialistService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getSpecialists()
      .subscribe(res => {
        this.specialists = res;
        this.cd.detectChanges();
      });
  }

  EditSpecialist(id: string) {

    this.router.navigate(['/admin/EditSpecialist', id]);

  }
  delete(id: string) {

    if (confirm("Delete this specialist doctor?")) {

      this.service.deleteSpecialist(id)
        .subscribe(() => {
          alert("Specialist deleted successfully");
          this.load();
        });

    }

  }


  sendEmergency(id: string) {

    if (confirm("Send emergency email to this specialist doctor?")) {

      this.service.sendEmergency(id)
        .subscribe(() => {
          alert("Emergency email sent successfully");
        });

    }

  }

}