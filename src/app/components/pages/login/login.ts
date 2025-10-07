// src/app/components/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule
  ]
})
export class Login {
  loginForm: FormGroup;
  firstTry = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { user, password } = this.loginForm.value;

    this.authService.login(user, password).subscribe({
      next: () => {
        this.firstTry = true; // reset error
        this.router.navigate(['/']); // ✅ redirect after login
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.firstTry = false; // show error message
      }
    });
  }
}
