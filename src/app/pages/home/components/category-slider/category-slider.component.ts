import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CategoryService } from '../../../../core/services/category/category.service';
import { Categories } from '../../../../shared/interfaces/categories';
import { SwiperContainer } from 'swiper/element';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-slider',
  imports: [RouterLink],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategorySliderComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platFormId: string) {}
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;

  private readonly categoryService = inject(CategoryService);
  get browserOnly() {
    return isPlatformBrowser(this.platFormId);
  }
  categories: Categories[] = [];
  ngOnInit(): void {
    this.getCategoryData();
  }
  getCategoryData(): void {
    this.categoryService.setGetCategory().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
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
