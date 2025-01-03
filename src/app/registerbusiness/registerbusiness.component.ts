import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../service/business.service';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: 'app-registerbusiness',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GoogleMapsModule],
  providers: [BusinessService],
  templateUrl: './registerbusiness.component.html',
  styleUrl: './registerbusiness.component.css'
})
export class RegisterbusinessComponent implements OnInit {
  registerForm: FormGroup;
  categories: any[] = [];
  subCategories: any[] = [];
  fileUpload: any;
  private messageService = inject(BusinessService);

  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  zoom = 10;
  marker: google.maps.LatLngLiteral | null = null;

  constructor(private fb: FormBuilder, private businessService: BusinessService) {
    debugger;
    this.registerForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3)]],
      EmailId: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(3)]],
      Description: ['', [Validators.required, Validators.maxLength(500)]],
      // Location: ['',[Validators.required]],
      location: new FormControl('', [Validators.required]),
      Latitude: [8.3],
      Longitude: [9.3],

      CategoryID: [''],
      BusinessID: [0],
      SubCategoryID: [''],
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  // Getter for Email Field
  get emailID() {
    return this.registerForm.get('EmailId');
  }

  get FormVal() {
    return this.registerForm.value
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.marker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.registerForm.controls['location'].setValue(
        `${this.marker.lat}, ${this.marker.lng}`
      );
    }
  }

  // Update the map and marker based on location input
  onLocationInput() {
    const location = this.registerForm.controls['location'].value;
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

  getCategories(): void {
    this.businessService.getCategories().subscribe((data) => {
      this.categories = data;
      if (!this.FormVal?.CategoryID) {
        this.registerForm.controls['CategoryID'].setValue(data[0]?.categoryID)
        this.getSubCategories();
      }
    });
  }

  getSubCategories() {
    this.businessService.getSubCategories(this.FormVal?.CategoryID).subscribe((result: any) => {
      this.subCategories = result;
      if (!this.FormVal?.SubCategoryID) {
        // this.registerForm.controls['SubCategoryID'].setValue(result[0]?.subCategoryID)
      }
      console.log(this.subCategories);
    })
  }

  onCategoryChange(eve: any): void {
    this.registerForm.controls['CategoryID'].setValue(eve.target.value)
    this.getSubCategories();
  }

  onSubCategoryChange(eve: any): void {
    this.registerForm.controls['SubCategoryID'].setValue(eve.target.value)
  }

  onFileChange(event: any) {
    this.fileUpload = event.target.files[0];
    console.log(this.fileUpload);

  }


  submit() {
    const formData = new FormData();
  
    // Append form data
    for (const key in this.registerForm.value) {
      if (this.registerForm.value.hasOwnProperty(key)) {
        formData.append(key, this.registerForm.value[key]);
      }
    }
  
    // Append the file upload data
    formData.append('VisitingCard', this.fileUpload);
  
    // Call the business registration service
    this.businessService.registerBusiness(formData).subscribe({
      next: (response) => {
        // Check if registration was successful
        if (response && response.success) {
          // Show success message
          alert('Successfully registered!');
          this.registerForm.reset();
        } else {
          // If response indicates failure, show failure message
          alert('Register failed!');
        }
      },
      error: (error) => {
        // Handle errors during registration
        alert('An error occurred during registration. Please try again.');
        this.registerForm.reset();
        console.error('Registration error:', error);
      }
    });
  }
}
