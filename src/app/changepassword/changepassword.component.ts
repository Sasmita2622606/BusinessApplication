import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AdminService],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent {
  changePasswordForm: FormGroup;
  token: string | null = null;
  message: string = '';
  error: string = '';
  email: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router,
    private route: ActivatedRoute, private authService : AuthService){
      this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    // Retrieve token from query parameter
    //this.route.queryParams.subscribe(params => {
      //this.token = params['token'] || '';
    //});    
    this.token = this.authService.getToken();
    console.log("token", this.token)
    }
  
    onSubmit(): void {
      if (this.changePasswordForm.invalid) {
        return;
      }
      const request: ChangePasswordRequest = {
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value,
        token: this.token
      };    
          
      this.adminService.changePassword(request).subscribe({
        next: res => {
          this.message = res.text;
          this.error = '';
          // Optionally navigate to the login page after reset
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: err => {
          this.error = err.error || 'Something went wrong';
          this.message = '';
        }
      });
    }
  
}
