import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../service/admin.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private AdminService: AdminService
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    console.log("this", this.error);
    }

  // Custom validator to check if passwords match
  passwordsMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  // Custom validator to check if newPassword and confirmPassword match
  checkPasswords(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit(): void {
    debugger
    if (this.changePasswordForm.invalid) {
      return;
    }    
    this.AdminService.changePassword(this.changePasswordForm.value).subscribe({
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
