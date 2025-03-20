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
  categoryID: any;
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
            name: this.businessDetails[0].name  || '',
            emailId: this.businessDetails[0].emailId || '',
            description: this.businessDetails[0].description || '',
            // location: this.businessDetails.location || '',
            categoryID: this.businessDetails[0].categoryID || '',
            subCategoryID: ''
          });
          
          this.getSubCategories(this.categoryID, this.businessDetails[0].subCategoryID);
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
      const selectedCategoryID = this.editBusinessForm?.controls['categoryID'].value;
      if (selectedCategoryID) {
        this.getSubCategories(selectedCategoryID, this.editBusinessForm?.controls['subCategoryID'].value);
      }
    });
  }
  

  getSubCategories(categoryID: number, subCategoryID?: number) {
    this.businessService.getSubCategories(categoryID).subscribe((result: any) => {
      this.subCategories = result;
      console.log("Subcategories:", this.subCategories);
  
      if (subCategoryID) {
        // ✅ Automatically Select the Correct Subcategory
        const foundSubCategory = this.subCategories.find((sub: any) => sub.subCategoryID === subCategoryID);
        if (foundSubCategory) {
          this.editBusinessForm.controls['subCategoryID'].setValue(subCategoryID);
        }
      }
    });
  }
  

  onCategoryChange(eve: any): void {
    const selectedCategoryID = Number(eve.target.value);
    this.editBusinessForm.controls['categoryID'].setValue(selectedCategoryID);
    this.editBusinessForm.controls['subCategoryID'].setValue('');
  
    // ✅ Fetch New Subcategories When Category Changes
    this.getSubCategories(selectedCategoryID);
  }
  

   onSubCategoryChange(eve: any): void {
     this.editBusinessForm.controls['subCategoryID'].setValue(eve.target.value)
   }

   get FormVal() {
    return this.editBusinessForm.value
  }
}
