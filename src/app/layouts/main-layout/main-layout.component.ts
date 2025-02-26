import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { AuthService } from '../../core/services/auth/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterOutlet,
    NgxSpinnerComponent,
    Dialog,
    ButtonModule,
    InputTextModule,
    Message,
    InputIcon,
    IconField,
    ReactiveFormsModule,
    Toast,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  isPasswordVisible: boolean = false;
  visible: boolean = false;
  changePassword: FormGroup = this.formBuilder.group(
    {
      currentPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[A-Z][\w!@#$%^&*()\-+=]{7,}$/),
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
    },
    { validators: this.confirmPassword }
  );

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  showHidePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.changePassword.invalid) {
      this.changePassword.markAllAsTouched();
    } else {
      this.authService.setChangePassword(this.changePassword.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Password Change',
            detail: 'Your password has been changed successfully!',
          });
          localStorage.setItem('authToken', res.token);
          this.changePassword.reset();
          this.closeDialog();
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Password Change Failed',
            detail: err.error.errors.msg,
          });
        },
      });
    }
  }
}
