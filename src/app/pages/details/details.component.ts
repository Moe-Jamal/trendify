import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../core/services/category/category.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-details',
  imports: [Breadcrumb, RouterModule, NgClass, NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private renderer: Renderer2
  ) {}
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  items: MenuItem[] | undefined;
  get browserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  productDetails: IProduct = {};
  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'background-color', '#fff');
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this.categoryService.setGetProductDetails(productId!).subscribe({
          next: (res) => {
            this.productDetails = res.data;
            console.log(res.data);
            this.items = [
              { label: 'Home', route: '/home' },
              { label: 'Category', route: '/shop' },
              { label: this.productDetails.category?.name },
              { label: this.productDetails.title },
            ];
            const swiperParams = {
              slidesPerView: 1,
              navigation: false,
              loop: true,
              pagination: false,
              // observer: true,
              // observeParents: true,
            };
            Object.assign(this.swiperContainer.nativeElement, swiperParams);
            this.swiperContainer.nativeElement.initialize();
          },
          error: (err) => {
            console.log(err);
          },
        });
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

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'background-color', '#f6f6f6');
  }
}
