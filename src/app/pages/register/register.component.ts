import { Component, inject } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthSliderComponent } from '../../shared/components/auth-slider/auth-slider.component';
@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  registerForm: FormGroup = this.formBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
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
      rePassword: [null],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      terms: [false, Validators.requiredTrue],
    },
    { validators: this.confirmPassword }
  );

  showHidePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else if (this.registerForm.valid) {
      this.isLoading = true;
      let registerData = { ...this.registerForm.value };
      delete registerData.terms;
      this.authService.setRegisterData(registerData).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
            this.messageService.add({
              severity: 'success',
              summary: 'Account Created',
              detail: 'Your account has been created successfully!',
            });
            this.isLoading = false;
            this.registerForm.reset();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail:
              err.error.message || 'Something went wrong. Please try again.',
          });
          this.isLoading = false;
        },
      });
    }
  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }
}
