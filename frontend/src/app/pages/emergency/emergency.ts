import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emergency.html',
  styleUrls: ['./emergency.css']
})
export class Emergency {

  showBox = false;
  userLocation: string = '';
  isLoading = false;

  // 🔁 Toggle popup
  toggleBox() {
    this.showBox = !this.showBox;
  }

  // 🚑 Emergency click
  handleEmergency() {
    this.toggleBox();
    this.isLoading = true;
    this.getLocation();
  }

  // 📍 Get Location
  getLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      this.isLoading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.userLocation = `https://www.google.com/maps?q=${lat},${lng}`;
        this.isLoading = false;

        console.log("Location:", this.userLocation);
      },
      () => {
        this.isLoading = false;
        alert("Please allow location access");
      }
    );
  }

  // 📞 Call (Mobile Only)
  callAmbulance() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = "tel:108";
    } else {
      alert("Calling works only on mobile devices 📱");
    }
  }

  // 💬 WhatsApp Emergency
  sendWhatsApp() {

    // ⏳ Wait if location loading
    if (this.isLoading) {
      alert("Fetching location... please wait ⏳");
      return;
    }

    // ❌ If no location
    if (!this.userLocation) {
      alert("Location not ready yet...");
      return;
    }

    // 👤 Get user name (from login if available)
    let name = localStorage.getItem("name") || "";
    let phone = "";

    // 👉 Ask only if not logged in
    if (!name) {
      name = prompt("Enter your name:") || "";
    }

    // 📞 Always ask phone (important for emergency)
    phone = prompt("Enter your mobile number:") || "";

    // ❌ Validation
    if (!name.trim() || !phone.trim()) {
      alert("Name and Mobile are required");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    // 📝 Message
    const message = `🚨 EMERGENCY ALERT!

👤 Name: ${name}
📞 Mobile: ${phone}

📍 Location:
${this.userLocation}`;

    // 📲 Emergency receiver number
    const phoneNumber = "917096867160"; // must be country code

    // ✅ WhatsApp link (stable)
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.location.href = url;

  }
}