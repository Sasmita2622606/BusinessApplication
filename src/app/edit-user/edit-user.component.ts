import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder, private businessService: BusinessService) {
    
  }
  ngOnInit() {
    this.roleID = Number(localStorage.getItem('roleId')); // Get role from local storage
    this.domainID = Number(localStorage.getItem('domainID'));
    this.getDetailsByID(this.roleID,this.domainID);
    if (this.roleID === 3) {
      this.getCategories();
      // Business Form
      this.editBusinessForm = this.fb.group({
        businessName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        description: ['', [Validators.required, Validators.maxLength(500)]],
        location: ['', Validators.required]
      });
    } else if (this.roleID === 4) {
      // Customer Form
      this.editCustomerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        location: ['', Validators.required]
      });
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
  
  getDetailsByID(roleID: number,domainID: number)
  {
    if(roleID == 3){
      this.businessService.getBusinessDetailById(domainID).subscribe((data)=>{
        this.businessDetails = data;
        console.log("BS Details: ", this.businessDetails)
      })
    }
    else if(roleID == 4){
      this.businessService.getCustomerDetailsByID(domainID).subscribe((data)=>{
        this.customerDetails = data;
        console.log("CX Details: ", this.customerDetails)
      })
    }

  }

  getCategories(): void {
    this.businessService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log("Categories:", this.categories);
      this.getSubCategories();
    });
  }

  getSubCategories() {
    this.businessService.getSubCategories(this.editBusinessForm.value.CategoryID).subscribe((result: any) => {
      this.subCategories = result;
    });
  }
}
