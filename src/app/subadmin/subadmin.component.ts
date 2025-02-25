import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-subadmin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AdminService],
  templateUrl: './subadmin.component.html',
  styleUrl: './subadmin.component.css'
})
export class SubadminComponent {
  loginFormSubadmin: FormGroup;
  responsedata: any;
  errorMessage: string | null = null;
  isButtonDisabled: boolean = false;
  getemail: string ='';

  constructor(private fb: FormBuilder,private subadminservice: AdminService,private router: Router) {
    localStorage.clear();
    // Initialize the form
    this.loginFormSubadmin = this.fb.group({
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log("this", this.email);
  }

  //Getters for form controls
  get email() {
    return this.loginFormSubadmin.get("email");
  }

  onSubmitSubadmin() {
    debugger
    if (this.loginFormSubadmin.valid) {
      this.isButtonDisabled = true;      
      this.subadminservice.addSubAdmin("").subscribe({
        next: (result : any) => {
          this.responsedata = result;
          if (this.responsedata != null && this.responsedata.token) {
            // Store the token in local storage
            localStorage.setItem('token', this.responsedata.token);
  
            // Navigate to the business search page
            this.router.navigateByUrl('/subadmin');
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
