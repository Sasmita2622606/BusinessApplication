import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  adminForm : FormGroup;
  errorMessage: string | null = null;
  isButtonDisabled: boolean = false;

constructor(private router : Router,private fb: FormBuilder) {
  // Initialize the form
      this.adminForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
}

// Getters for form controls
get username() {
  return this.adminForm.get('username');
}

get password() {
  return this.adminForm.get('password');
}

// Example method to set an error message
handleLoginError() {
  this.errorMessage = 'Invalid username or password';
}

// Method to clear the error message
clearError() {
  this.errorMessage = null;
}

onSubmit(){

}



}
