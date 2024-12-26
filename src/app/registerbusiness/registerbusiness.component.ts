import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../service/business.service';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: 'app-registerbusiness',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, GoogleMapsModule],
  providers:[BusinessService],
  templateUrl: './registerbusiness.component.html',
  styleUrl: './registerbusiness.component.css'
})
export class RegisterbusinessComponent implements OnInit {
  registerForm: FormGroup;
  categories: any[] = [];
  subCategories: any[] = [];
  fileUpload: any;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  mapCenter = { lat: 10.8505, lng: 76.2711 }; // Default location (Kerala)



  constructor(private fb: FormBuilder, private businessService: BusinessService) {
    this.registerForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3)]],
      Password:['', [Validators.required, Validators.minLength(3)]],
      Description: ['', [Validators.required, Validators.maxLength(500)]],
      Location: ['',[Validators.required]],
      Latitude:[8.3],
      Longitude:[9.3],
      CategoryID: ['', [Validators.required]],
      BusinessID: [0],
      SubCategoryID: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    console.log(this.categories, "test")
    this.initializeAutocomplete();
  }

  get FormVal() {
    return this.registerForm.value
  }

  initializeAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'IN' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        this.mapCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        // Update form values with latitude and longitude
        this.registerForm.patchValue({
          Latitude: this.mapCenter.lat,
          Longitude: this.mapCenter.lng,
          Location: place.formatted_address || place.name
        });
      }
    });
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
    debugger
    const formData = new FormData(); 
    
    for (const key in this.registerForm.value) {
      formData.append(key, this.registerForm.value[key]);
    }
    formData.append('VisitingCard',this.fileUpload)
    
    this.businessService.registerBusiness(formData).subscribe(response => {
      alert('Business registered successfully!');
    });
  }
}
