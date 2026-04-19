import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { BookAppointment } from './appointment/book-appointment/book-appointment';
import { Checkup } from './pages/checkup/checkup';
import { CentreOfExcellence } from './pages/centre-of-excellence/centre-of-excellence';
import { AuthGuard } from './guards/auth-guard';
import { BookForm } from './appointment/book-form/book-form/book-form';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Specialists } from './pages/specialists/specialists';

import { Patient } from './patient/patient/patient';
import { DoctorDashboard } from './doctor/doctor-dashboard/doctor-dashboard';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { RoleGuard } from './guards/role-guard-guard';
import { AddDoctor } from './admin/add-doctor/add-doctor';
import { ManageDoctors } from './admin/manage-doctors/manage-doctors';
import { AdminAppointments } from './admin/admin-appointments/admin-appointments';
import { DoctorAppointment } from './doctor/doctor-appointments/doctor-appointments';
import { EditDoctor } from './admin/edit-doctor/edit-doctor';
import { AddSpecialistComponent } from './admin/add-specialist/add-specialist';
import { SpecialistsComponent } from './admin/specialists-component/specialists-component';
import { EditSpecialist } from './admin/edit-specialist/edit-specialist';


export const routes: Routes = [

  // PUBLIC ROUTES
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'specialists', component: Specialists },
  { path: 'checkup', component: Checkup },
  { path: 'centre-of-excellence', component: CentreOfExcellence },


  {
    path: 'book-appointment',
    component: BookAppointment,
    canActivate: [AuthGuard]
  },

  { path: 'book-form/:id', component: BookForm },

  // =============================
  // ADMIN ROUTES
  // =============================
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    children: [
      { path: '', component: AdminDashboard },
      { path: 'add-doctor', component: AddDoctor },
      { path: 'doctors', component: ManageDoctors },
      { path: 'appointments', component: AdminAppointments },
      { path: 'edit-doctor/:id', component: EditDoctor },
      { path: 'add-specialist', component: AddSpecialistComponent },
      { path: 'specialistsComponent', component: SpecialistsComponent },
      { path: 'EditSpecialist/:id', component: EditSpecialist }
    ]
  },

  // =============================
  // DOCTOR ROUTES
  // =============================
  {
    path: 'doctor',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'doctor' },
    children: [
      { path: '', component: DoctorDashboard },
      { path: 'appointments', component: DoctorAppointment }
    ]
  },

  // =============================
  // PATIENT ROUTES (✅ FIXED)
  // =============================
  {
    path: 'patient',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'patient' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./patient/patient/patient')
            .then(m => m.Patient)
      }
    ]
  },

  { path: '**', redirectTo: '' }

];