import { Component, inject } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';

import { Toast } from 'primeng/toast';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSliderComponent } from '../../shared/components/auth-slider/auth-slider.component';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-forget-password',
  imports: [
    ReactiveFormsModule,
    InputIcon,
    IconField,
    InputTextModule,
    PasswordModule,
    Message,
    Toast,
    RouterLink,
    ButtonModule,
    StepperModule,
    AuthSliderComponent,
    InputOtp,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
  providers: [MessageService],
})
export class ForgetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  activeStepIndex = 1;
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;
  userEmail: FormGroup = this.formBuilder.group({
    email: [
      null,
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
  });
  resetCode: FormGroup = this.formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
  });

  resetPassword: FormGroup = this.formBuilder.group(
    {
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[A-Z][\w!@#$%^&*()\-+=]{7,}$/),
        ],
      ],
      rePassword: [null],
    },
    { validators: this.confirmPassword }
  );

  confirmPassword(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const rePassword = group.get('rePassword')?.value;

    return newPassword === rePassword ? null : { mismatch: true };
  }
  showHidePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  sendCode(): void {
    if (this.userEmail.invalid) {
      this.userEmail.markAllAsTouched();
    } else if (this.userEmail.valid) {
      this.isLoading = true;
      this.authService.setEmailVerify(this.userEmail.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Verify Code',
              detail: res.message,
            });
            this.isLoading = false;
            this.activeStepIndex += 1;
          }
          console.log(res);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          this.isLoading = false;
          console.log(err);
        },
      });
    }
  }

  verifyCode(): void {
    let resetCodeControl = this.resetCode.get('resetCode');
    if (resetCodeControl?.value) {
      resetCodeControl.setValue(resetCodeControl.value?.trim());
      this.resetCode.updateValueAndValidity();
      if (this.resetCode.valid) {
        this.isLoading = true;
        this.authService
          .setResetCode(this.resetCode.value.resetCode)
          .subscribe({
            next: (res) => {
              if (res.status === 'Success') {
                this.isLoading = false;
                this.activeStepIndex += 1;
                this.resetCode.reset();
              }
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
              });
              this.isLoading = false;
              console.log(err);
            },
          });
      }
    }
  }

  newPassword(): void {
    if (this.resetPassword.invalid) {
      this.resetPassword.markAllAsTouched();
    } else if (this.resetPassword.valid) {
      this.isLoading = true;
      this.authService
        .setResetPassword(
          this.userEmail.value.email,
          this.resetPassword.value.newPassword
        )
        .subscribe({
          next: (res) => {
            if (res.token) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reset Password',
                detail: 'Password reset successful! You can now log in.',
              });
              this.isLoading = false;
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);
            }
            console.log(res);
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
            this.isLoading = false;
          },
        });
    }
  }
  prevStep(): void {
    this.activeStepIndex -= 1;
  }
}
