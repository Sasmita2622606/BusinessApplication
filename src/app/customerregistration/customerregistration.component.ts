import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMapsModule } from "@angular/google-maps";
import { BusinessService } from '../service/business.service';

@Component({
  selector: 'app-customerregistration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GoogleMapsModule],
  providers: [BusinessService],
  templateUrl: './customerregistration.component.html',
  styleUrl: './customerregistration.component.css'
})
export class CustomerregistrationComponent implements OnInit {
  cusRegisterForm: FormGroup;
  fileUpload: any;
  saveresponse: any;
  messageclass = '';
  message = '';
  private messageService = inject(BusinessService);

  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  zoom = 10;
  marker: google.maps.LatLngLiteral | null = null;

  constructor(private fb: FormBuilder, private businessService: BusinessService) {
    this.cusRegisterForm = this.fb.group({
      Cus_Id: [0],
      Cus_EmailId: ['', [Validators.required, Validators.email]],
      Cus_Password: ['', [Validators.required, Validators.minLength(3)]],
      Cus_Location: ['', [Validators.required]],
      //location: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

  }

   // Getter for Email Field
   get emailID() {
    return this.cusRegisterForm.get('Cus_EmailId');
  }

  // Getter for Password Field
  get password() {
    return this.cusRegisterForm.get('Cus_Password');
  }

  // Getter for Location Field
  get location() {
    return this.cusRegisterForm.get('Cus_Location');
  }


  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.marker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.cusRegisterForm.controls['Cus_Location'].setValue(
        `${this.marker.lat}, ${this.marker.lng}`
      );
    }
  }

  // Update the map and marker based on location input
  onLocationInput() {
    debugger
    const location = this.cusRegisterForm.controls['Cus_Location'].value;
    if (location) {
      const geocoder = new google.maps.Geocoder(); // Works with gomaps.pro as well
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          this.center = { lat: lat(), lng: lng() }; // Move the map center
          this.marker = { lat: lat(), lng: lng() }; // Update the marker
        } else {
          // this.businessService.add({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'Could not find the location',
          // });
        }
      });
    }
  }

  submit(): void {
    debugger;
  
    // Check if the form is valid
    if (!this.cusRegisterForm.valid) {
      this.showAlert("Form is invalid. Please check the inputs.", "error");
      return;
    }
  
    console.log('Form Submitted', this.cusRegisterForm.value);
  
    // Call the service to register the customer
    this.businessService.registerCustomer(this.cusRegisterForm.value).subscribe({
      next: (response) => this.onRegisterSuccess(response),
      error: (error) => this.onRegisterError(error),
    });
  }
  
  private onRegisterSuccess(response: { data?: string }): void {
    this.saveresponse = response;
  
    // Check the response data
    if (response?.data === 'pass') {
      this.showAlert("Saved Successfully", "success");
      this.cusRegisterForm.reset();
    } else {
      this.showAlert("Save failed", "error");
    }
  }
  
  private onRegisterError(error: any): void {
    console.error("Error during registration:", error);
  
    // Fallback error message
    const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
    this.showAlert(errorMessage, "error");
    this.cusRegisterForm.reset();
  }
  
  private showAlert(message: string, type: "success" | "error"): void {
    // Replace with a UI library like SweetAlert2 or Material Dialog for better user experience
    alert(message);
  
    // Optional: Log the alert for debugging purposes
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}
