import { isPlatformBrowser, NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-home-slider',
  imports: [],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeSliderComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}
  get browserOnly() {
    return isPlatformBrowser(this.platformId);
  }
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;

  ngAfterViewInit() {
    const swiperParams = {
      slidesPerView: 1,
      pagination: { clickable: true },
      navigation: false,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
    };
    Object.assign(this.swiperContainer.nativeElement, swiperParams);
    this.swiperContainer.nativeElement.initialize();
  }
  slidePrev(): void {
    if (this.swiperContainer?.nativeElement?.swiper) {
      this.swiperContainer?.nativeElement?.swiper.slidePrev();
    }
  }

  slideNext(): void {
    if (this.swiperContainer?.nativeElement?.swiper) {
      this.swiperContainer?.nativeElement?.swiper.slideNext();
    }
  }
}
