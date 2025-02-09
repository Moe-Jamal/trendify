import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
@Component({
  selector: 'app-auth-slider',
  imports: [],
  templateUrl: './auth-slider.component.html',
  styleUrl: './auth-slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthSliderComponent {
  constructor(@Inject(PLATFORM_ID) private platFormId: string) {}
  get browserOnly() {
    return isPlatformBrowser(this.platFormId);
  }
}
