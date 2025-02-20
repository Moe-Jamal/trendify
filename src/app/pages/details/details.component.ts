import { DatePipe, isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressBar } from 'primeng/progressbar';
import { SwiperContainer } from 'swiper/element';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoryService } from '../../core/services/category/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Toast } from 'primeng/toast';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
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
    Toast,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    this.twoDaysLater.setDate(this.currentDate.getDate() + 2);
  }
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  private readonly wishlistService = inject(WishlistService);

  items: MenuItem[] | undefined;
  wishlistIds: WritableSignal<string[]> = signal([]);
  cartCount: WritableSignal<number> = signal(1);
  isloading: WritableSignal<boolean> = signal(false);
  isloadingWishlist: WritableSignal<boolean> = signal(false);
  get browserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  productDetails: IProduct | null = null;
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
              { label: this.productDetails?.category?.name },
              { label: this.productDetails?.title },
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
    this.getUserWishlist();
  }

  getSimilerProducts(): void {
    this.categoryService
      .setGetProducts(this.productDetails?.category?._id)
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

  increasCount(): void {
    this.cartCount.update((value) => value + 1);
  }
  decreasCount(): void {
    if (this.cartCount() > 1) {
      this.cartCount.update((value) => value - 1);
    }
  }

  addToCart(id: string): void {
    this.isloading.set(true);
    this.cartService.setAddToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.messageService.add({
          severity: 'success',
          summary: 'Product Added',
          detail: res.message,
        });
        this.cartService.setUpdateUserCart(id, this.cartCount()).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
        this.isloading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Faild To Add Product To cart',
        });
        this.isloading.set(false);
      },
    });
  }

  getUserWishlist(): void {
    this.wishlistService.setGetWishlist().subscribe({
      next: (res) => {
        this.wishlistIds.set(res.data.map((element: any) => element.id));
        console.log(this.wishlistIds());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addRemoveWishlist(id: string): void {
    this.isloadingWishlist.set(true);
    if (this.wishlistIds().includes(id)) {
      this.wishlistService.setRemoveWishlist(id).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Product Removed',
            detail: res.message,
          });
          this.wishlistService.wishlistCount.set(res.data.length);
          this.wishlistIds.set(res.data);
          this.isloadingWishlist.set(false);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Faild To Remove Product From wishlist',
          });
          console.log(err);
          this.isloadingWishlist.set(false);
        },
      });
    } else {
      this.wishlistService.setAddToWishlist(id).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Product Added',
            detail: res.message,
          });
          this.wishlistService.wishlistCount.set(res.data.length);
          this.wishlistIds.set(res.data);
          this.isloadingWishlist.set(false);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Faild To Add Product To wishlist',
          });
          console.log(err);
          this.isloadingWishlist.set(false);
        },
      });
    }
  }
}
