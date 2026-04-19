import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl:'/navbar.css'
})
export class Navbar {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
  }
}