import { Component, inject } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthSliderComponent } from '../../shared/components/auth-slider/auth-slider.component';
@Component({
  selector: 'app-login',
  imports: [
    InputIcon,
    IconField,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    Message,
    Toast,
    RouterLink,
    AuthSliderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  loginForm: FormGroup = this.formBuilder.group({
    email: [
      null,
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: [
      null,
      [
        Validators.required,
        Validators.pattern(/^[A-Z][\w!@#$%^&*()\-+=]{7,}$/),
      ],
    ],
  });

  showHidePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.setLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('authToken', res.token);
            this.authService.saveUserData();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
            this.messageService.add({
              severity: 'success',
              summary: 'Login Successful',
              detail: 'You have been logged in successfully',
            });
            this.isLoading = false;
            this.loginForm.reset();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: err.error.message,
          });
          this.isLoading = false;
        },
      });
    }
  }
}
