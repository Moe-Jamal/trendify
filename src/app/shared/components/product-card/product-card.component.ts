import { SlicePipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../core/services/cart/cart.service';
import { IProduct } from '../../interfaces/iproduct';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-product-card',
  imports: [SlicePipe, RouterLink, Toast],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  providers: [MessageService],
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  @Input() products: IProduct[] = [];
  @Input() start: number = 0;
  @Input() end?: number;
  isloading: WritableSignal<string> = signal('');
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
    this.isloading.set(id);
    this.cartService.setAddToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems);
        console.log(this.cartService.cartNumber());
        this.messageService.add({
          severity: 'success',
          summary: 'Product Added',
          detail: res.message,
        });
        this.isloading.set('');
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Faild To Add Product To cart',
        });
        this.isloading.set('');
      },
    });
  }
}
