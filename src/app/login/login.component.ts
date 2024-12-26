import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginService } from '../service/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  responsedata: any;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private service: LoginService, private router: Router) {
    localStorage.clear();
    // Initialize the form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getters for form controls
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Example method to set an error message
  handleLoginError() {
    this.errorMessage = 'Invalid username or password';
  }

  // Method to clear the error message
  clearError() {
    this.errorMessage = null;
  }

  onSubmit() {
    debugger
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.service.onSubmit(this.loginForm.value).subscribe(result => {
        this.responsedata = result;
        if (this.responsedata != null) {
          localStorage.setItem('token', this.responsedata.token);
          this.router.navigateByUrl('/Businesssearch')
        } else {
          this.errorMessage="Login Failed"
        }
      });
    } 
    else{
      this.errorMessage="Enter valid data"
    }
  }
}
