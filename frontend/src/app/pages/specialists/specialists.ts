import { Component, OnInit } from '@angular/core';
import { SpecialistService } from '../../services/specialist.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './specialists.html',
  styleUrls: ['./specialists.css']
})
export class Specialists implements OnInit {

  specialists: any[] = [];   // ⭐ THIS WAS MISSING

  constructor(private service: SpecialistService,
              private cd:ChangeDetectorRef
  ) {}

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

}