import { ProgressBar } from 'primeng/progressbar';
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
import { DatePipe, isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { SwiperContainer } from 'swiper/element';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
@Component({
  selector: 'app-details',
  imports: [
    Breadcrumb,
    RouterModule,
    NgClass,
    NgIf,
    ButtonModule,
    DatePipe,
    AccordionModule,
    ProgressBar,
    DividerModule,
    ProductCardComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private renderer: Renderer2
  ) {
    this.twoDaysLater.setDate(this.currentDate.getDate() + 2);
  }
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  items: MenuItem[] | undefined;
  get browserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  productDetails: IProduct = {};
  productColor = [
    { name: 'Blue', code: '#507CCD' },
    { name: 'White', code: '#fff' },
    { name: 'Brown', code: '#C88242' },
    { name: 'Black', code: '#212F39' },
    { name: 'Soft Clay', code: '#DCB9A8' },
    { name: 'Misty Olive', code: '#A7B2A3' },
  ];
  selectedColor: string = 'Blue';
  productSize = [
    { name: 'Extra Small', code: 'XS' },
    { name: 'Small', code: 'S' },
    { name: 'Medium', code: 'M' },
    { name: 'Large', code: 'L' },
    { name: 'Extra Large', code: 'XL' },
    { name: 'Double Extra Large', code: 'XXL' },
    { name: 'Triple Extra Large', code: 'XXXL' },
  ];
  selectedSize: string = 'Medium';
  currentDate: Date = new Date();
  twoDaysLater: Date = new Date();
  similerProducts: IProduct[] = [];
  ngOnInit(): void {
    // this.renderer.setStyle(document.body, 'background-color', '#fff');
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this.categoryService.setGetProductDetails(productId!).subscribe({
          next: (res) => {
            this.productDetails = res.data;
            console.log(res.data);
            this.getSimilerProducts();
            this.items = [
              { label: 'Home', route: '/home' },
              { label: 'Category', route: '/shop' },
              { label: this.productDetails.category?.name },
              { label: this.productDetails.title },
            ];
            if (this.swiperContainer?.nativeElement?.swiper) {
              this.swiperContainer.nativeElement.swiper.slideTo(0);
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }

  getSimilerProducts(): void {
    this.categoryService
      .setGetProducts(this.productDetails.category?._id)
      .subscribe({
        next: (res) => {
          this.similerProducts = res.data;
          console.log(res.data);
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

  chooseColor(color: string): void {
    this.selectedColor = color;
  }
  chooseSize(size: string): void {
    this.selectedSize = size;
  }
  // ngOnDestroy(): void {
  //   this.renderer.setStyle(document.body, 'background-color', '#f6f6f6');
  // }
}
