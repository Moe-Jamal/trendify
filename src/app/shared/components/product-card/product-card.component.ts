import { Component, Input } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [SlicePipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() products: IProduct[] = [];
  @Input() start: number = 0;
  @Input() end?: number;
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
}
