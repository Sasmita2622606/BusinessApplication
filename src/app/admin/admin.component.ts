import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  providers: [LoginService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  adminLoginForm: FormGroup;
  errorMessage: string | null = null;
  isButtonDisabled: boolean = false;
  responsedata: any;
  roleId: any;

  constructor(private router: Router, private fb: FormBuilder, private service: LoginService) {
    // Initialize the form
    this.adminLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getters for form controls
  get username() {
    return this.adminLoginForm.get('username');
  }

  get password() {
    return this.adminLoginForm.get('password');
  }

  // Example method to set an error message
  handleLoginError() {
    this.errorMessage = 'Invalid username or password';
  }

  // Method to clear the error message
  clearError() {
    this.errorMessage = null;
  }

  onSubmitSuperAdmin() {
    if (this.adminLoginForm.valid) {
      this.isButtonDisabled = true;
      const loginData = this.adminLoginForm.value;
      this.service.onSubmit(loginData).subscribe({
        next: (result) => {
          this.responsedata = result;
          if (this.responsedata != null && this.responsedata.token) {
            // Store the token in local storage
            localStorage.setItem('token', this.responsedata.token);

            if(this.responsedata.roleId == 1)
            {
              // Navigate to the add sub admin page
            this.router.navigateByUrl('/Subadmin');
            }
            else{
              // Navigate to the sub admin login page
            this.router.navigateByUrl('/Businesssearch');
            }

            
          } else {
            // If token is not available, show a failed login message
            alert('Login Failed!');
            this.isButtonDisabled = false;
          }
        },
        error: (error) => {
          this.isButtonDisabled = false;
          // Handle HTTP error responses like Unauthorized (401)
          if (error.status === 401) {
            alert('Incorrect username or password. Unauthorized!');
          } else {
            // Generic error message for any other errors
            alert('An error occurred during login. Please try again.');
          }
        }
      });
    } else {
      alert('Enter valid username and password!');
      this.isButtonDisabled = false;
    }
  }
}
