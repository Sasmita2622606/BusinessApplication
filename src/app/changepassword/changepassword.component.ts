import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';

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
  token: string = '';
  message: string = '';
  error: string = '';
  email: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router,
    private route: ActivatedRoute,
  ) {
    this.changePasswordForm = this.fb.group({
      //email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    debugger
    //   this.changePasswordForm = this.fb.group({
    //   currentPassword: ['', Validators.required],  // <-- Ensure the control name matches
    //   newPassword: ['', [Validators.required, Validators.minLength(6)]],
    //   confirmPassword: ['', Validators.required]
    // });

    // Retrieve token from query parameter
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
    }
  
    onSubmit(): void {
      debugger
      if (this.changePasswordForm.invalid) {
        return;
      }
      const request: ChangePasswordRequest = {
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value,
        token: ''
      };    
          
      this.adminService.changePassword(request).subscribe({
        next: res => {
          this.message = res.message;
          this.error = '';
        },
        error: err => {
          this.error = err.error || 'Something went wrong';
          this.message = '';
        }
      });
    }
  
}
