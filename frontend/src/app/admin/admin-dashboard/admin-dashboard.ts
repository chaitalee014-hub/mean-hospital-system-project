import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink,RouterOutlet,RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
   
}
