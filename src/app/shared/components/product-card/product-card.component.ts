import { SlicePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  Input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../interfaces/iproduct';
import { CategoryService } from '../../../core/services/category/category.service';

@Component({
  selector: 'app-product-card',
  imports: [SlicePipe, RouterLink, Toast],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  providers: [MessageService],
})
export class ProductCardComponent {
  constructor() {
    effect(() => {
      this.wishlistdata.set(this.wishlistIDs());
    });
  }
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  private readonly wishlistService = inject(WishlistService);
  private readonly categoryService = inject(CategoryService);
  @Input() products: IProduct[] = [];
  @Input() start: number = 0;
  @Input() end?: number;
  wishlistIDs: InputSignal<string[]> = input(['']);
  isloadingCart: WritableSignal<string> = signal('');
  isloadingWishlist: WritableSignal<string> = signal('');
  wishlistdata: WritableSignal<string[]> = signal(this.wishlistIDs());
  calculateDiscount(price?: number, priceAfterDiscount?: number): string {
    if (price && priceAfterDiscount) {
      return Math.round(((price - priceAfterDiscount) / price) * 100) + '%';
    }
    return '';
  }

  formatTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  addToCart(id: string): void {
    this.isloadingCart.set(id);
    this.cartService.setAddToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.messageService.add({
          severity: 'success',
          summary: 'Product Added',
          detail: res.message,
        });
        this.isloadingCart.set('');
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Faild To Add Product To cart',
        });
        this.isloadingCart.set('');
      },
    });
  }

  addRemoveWishlist(id: string): void {
    this.isloadingWishlist.set(id);
    if (this.wishlistdata().includes(id)) {
      this.wishlistService.setRemoveWishlist(id).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Product Removed',
            detail: res.message,
          });
          this.wishlistService.wishlistCount.set(res.data.length);
          this.wishlistdata.set(res.data);
          this.isloadingWishlist.set('');
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Faild To Remove Product From wishlist',
          });
          console.log(err);
          this.isloadingWishlist.set('');
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
          this.wishlistdata.set(res.data);
          this.isloadingWishlist.set('');
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Faild To Add Product To wishlist',
          });
          console.log(err);
          this.isloadingWishlist.set('');
        },
      });
    }
  }
}
