import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Modal {

  openLoginModal() {
    console.log("Login modal opened");
  }

}
