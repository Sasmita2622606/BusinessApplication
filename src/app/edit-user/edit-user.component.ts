import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BusinessService } from '../service/business.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet, RouterLink, HttpClientModule, CommonModule],
  providers:[BusinessService],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  roleID : any;
  domainID : any;
  emailID : any;
  businessDetails: any;
  customerDetails: any;
  editBusinessForm!: FormGroup;
  editCustomerForm!: FormGroup;
  categories: any;
  subCategories: any;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 }; // Default to San Francisco
  zoom = 10;
  marker: google.maps.LatLngLiteral | null = null;
  fileName: string | undefined;
  imagePreview: string | undefined;
  fileUpload: any;
  constructor(private fb: FormBuilder, private businessService: BusinessService) {
   
  }

  ngOnInit() {
    this.roleID = Number(localStorage.getItem('roleId'));
    this.domainID = Number(localStorage.getItem('domainID'));
  
    if (this.roleID === 3) {
      // ✅ Initialize Form First
      this.editBusinessForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        emailId: ['', [Validators.required, Validators.email]],
        description: ['', [Validators.required, Validators.maxLength(500)]],
        categoryID: ['', [Validators.required]],
        subCategoryID: ['', [Validators.required]]
      });
  
      // Then Fetch Data
      this.getCategories();
      this.getDetailsByID(this.roleID, this.domainID);
    } else if (this.roleID === 4) {
      this.editCustomerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]]
      });
  
      this.getDetailsByID(this.roleID, this.domainID);
    }
  }
  
  

  submitBusinessForm() {
    if (this.editBusinessForm.valid) {
      console.log('Business Updated:', this.editBusinessForm.value);
    }
  }

  submitCustomerForm() {
    if (this.editCustomerForm.valid) {
      console.log('Customer Updated:', this.editCustomerForm.value);
    }
  }
  
  getDetailsByID(roleID: number, domainID: number) {
    if (roleID === 3) {
      this.businessService.getBusinessDetailById(domainID).subscribe((data) => {
        this.businessDetails = data;
        console.log("Business Details: ", this.businessDetails);
  
        // Ensure data exists before patching
        if (this.businessDetails && this.editBusinessForm) {
          this.editBusinessForm.patchValue({
            name: this.businessDetails.name  || '',
            emailId: this.businessDetails.emailId || '',
            description: this.businessDetails.description || '',
            // location: this.businessDetails.location || '',
            categoryID: this.businessDetails.categoryID || '',
            subCategoryID: this.businessDetails.subCategoryID || ''
          });
        }
      });
    } else if (roleID === 4) {
      this.businessService.getCustomerDetailsByID(domainID).subscribe((data) => {
        this.customerDetails = data;
        console.log("Customer Details: ", this.customerDetails);
  
        if (this.customerDetails && this.editCustomerForm) {
          this.editCustomerForm.patchValue({
            name: this.customerDetails.name || '',
            email: this.customerDetails.emailId || ''
            // location: this.customerDetails.location || ''
          });
        }
      });
    }
  }
  
  
  getCategories(): void {
    this.businessService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log("Categories:", this.categories);
      // this.getSubCategories();
    });
  }

  // getSubCategories() {
  //   this.businessService.getSubCategories(this.businessDetails.categoryID).subscribe((result: any) => {
  //     this.subCategories = result;
  //   });
  // }

  onCategoryChange(eve: any): void {
    this.editBusinessForm.controls['categoryID'].setValue(eve.target.value)
    this.editBusinessForm.controls['subCategoryID'].setValue('');
    // this.getSubCategories();
  }

   onSubCategoryChange(eve: any): void {
     this.editBusinessForm.controls['subCategoryID'].setValue(eve.target.value)
   }

}
