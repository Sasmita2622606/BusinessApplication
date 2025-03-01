import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-subadmin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  providers: [AdminService],
  templateUrl: './subadmin.component.html',
  styleUrl: './subadmin.component.css'
})
export class SubadminComponent {
  loginFormSubadmin: FormGroup;
  responsedata: any;
  errorMessage: string | null = null;
  isButtonDisabled: boolean = false;
  getemail: string = '';
  emailExists: boolean = false;

  constructor(private fb: FormBuilder, private subadminservice: AdminService, private router: Router) {
    localStorage.clear();
    // Initialize the form
    this.loginFormSubadmin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    console.log("this", this.email);
  }

  //Getters for form controls
  get email() {
    return this.loginFormSubadmin.get("email");
  }

  checkEmailAdmin() {
    const email = this.loginFormSubadmin.get('email')?.value;
    if (email) {
      this.subadminservice.checkEmailExistsAdmin(email).subscribe({
        next: (exists) => {
          this.emailExists = exists;
        },
        error: () => {
          this.emailExists = false;
        }
      });
    }
  }

  onSubmitSubadmin() {
    if (this.loginFormSubadmin.valid) {
      this.isButtonDisabled = true;
      this.subadminservice.addSubAdmin(this.loginFormSubadmin.get("email")?.value).subscribe({
        next: (result: any) => {
          this.responsedata = result;
          if (this.responsedata != null) {
            // Store the token in local storage
            localStorage.setItem('token', this.responsedata.token);
            // Navigate to the business search page
            //this.router.navigateByUrl('/Businesssearch');
            alert('provided user has added as admin and notified the same in the given email.');
          } else {
            // If token is not available, show a failed login message
            this.isButtonDisabled = false;
          }
        },
      });
    }
    else {
      alert('Please enter a valid EmailId');
      this.isButtonDisabled = false;
    }
  }
}
