import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BusinessService } from '../service/business.service';
export interface Business {
  name: string;
  description: string;
  image: string;
  distanceKm: number;
}
@Component({
  selector: 'app-businesssearch',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatTabsModule],
  providers: [BusinessService],
  templateUrl: './businesssearch.component.html',
  styleUrl: './businesssearch.component.css'
})
export class BusinesssearchComponent implements OnInit {
  searchForm !: FormGroup;
  //activeTab: string = 'tab1';
  //categories = ['Medical', 'Furniture', 'General Store', 'Food', 'Catering'];
  categories: any[] = [];
  businessList: any[] = [];
  isTableVisible: boolean = false; // Table visibility flag
  imageBaseUrl = 'http://localhost:7000/uploads/';

  selectedCategory!: string;
  selectedSubCategory!: string;
  selectedBusiness: any = null; // Initially null
  subCategories: any;

  constructor(private fb: FormBuilder, private businessService: BusinessService) { }

  ngOnInit(): void {
    // Initialize reactive form
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
    });

    this.getCategories();
    console.log(this.categories, "test")
  }

  // Method to generate the full image URL
  getImageUrl(visitingCard: string): string {
    debugger
    return `${this.imageBaseUrl}${visitingCard}`;
  }

  // Handle category selection
  selectCategory(category: any): void {
    this.selectedCategory = category?.categoryName;
    this.getSubCategories(category?.categoryID)

    // this.searchForm.patchValue({ category, subcategory: '' });
  }

  getSubCategories(id: any) {
    this.businessService.getSubCategories(id).subscribe((result: any) => {
      this.subCategories = result;
    })
  }

  callSearch() {
    this.businessService.searchBusinesses(this.selectedCategory, this.selectedSubCategory).subscribe((result: any) => {
      this.businessList = result;

      console.log(this.businessList, "bus")
      this.isTableVisible = true;
    })
  }

  replacePercentage(val: any) {
    // val = val.replace('%', '/');
    // val = val.replace('%%', '/');
    console.log(val);
    return val;
  }

  get FormVal() {
    return this.searchForm.value
  }

  getCategories(): void {
    this.businessService.getCategories().subscribe((data) => {
      this.categories = data;
      if (!this.FormVal?.CategoryID) {
        this.searchForm.controls['CategoryID'].setValue(data[0]?.categoryID)
        //this.getSubCategories();
      }
    });
  }

  // Handle subcategory selection
  selectSubcategory(subcategory: any): void {
    this.selectedSubCategory = subcategory?.subCategoryName
    // this.searchForm.patchValue({ subcategory });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.searchForm.valid) {
      console.log('Form Submitted:', this.searchForm.value);
    } else {
      console.error('Form is invalid');
    }
  }

  // View business details when a name is clicked
  viewBusinessDetails(business: any): void {
    this.selectedBusiness = business;
  }

  // Open popup with selected business details
  openPopup(business: any): void {
    this.selectedBusiness = business;
  }

  // Close the popup
  closePopup(): void {
    this.selectedBusiness = null;
  }
}
