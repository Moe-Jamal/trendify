import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import { CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CategoryService } from '../../core/services/category/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-cart',
  imports: [
    Breadcrumb,
    NgClass,
    NgIf,
    RouterLink,
    ButtonModule,
    CommonModule,
    DatePipe,
    ConfirmDialog,
    ToastModule,
    ProductCardComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class CartComponent {
  @ViewChild('clearCartDialog') clearCartDialog!: ConfirmDialog;
  @ViewChild('deleteItemDialog') deleteItemDialog!: ConfirmDialog;
  private readonly cartService = inject(CartService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly categoryService = inject(CategoryService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  items: MenuItem[] | undefined;
  wishlistIds: WritableSignal<string[]> = signal([]);
  cartData: WritableSignal<ICart | null> = signal<ICart | null>(null);
  isDecreasing: WritableSignal<string | null> = signal(null);
  isIncreasing: WritableSignal<string | null> = signal(null);
  selectedProductID: WritableSignal<string> = signal('');
  similerProducts: WritableSignal<[]> = signal([]);
  start: number = Math.floor(Math.random() * 36);
  end: number = this.start + 5;
  currentDate: Date = new Date();
  twoDaysLater: Date = new Date();

  ngOnInit(): void {
    this.twoDaysLater.setDate(this.currentDate.getDate() + 2);
    this.items = [
      { label: 'Home', route: '/home' },
      { label: 'Category', route: '/shop' },
      { label: 'Cart' },
    ];
    this.getUserCart();
    this.getSimilerProducts();
    this.getUserWishlist();
  }

  getUserCart(): void {
    this.cartService.setGetUserCart().subscribe({
      next: (res) => {
        this.cartData.set(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateCount(
    id: string,
    count: number,
    action: 'increase' | 'decrease'
  ): void {
    action === 'increase'
      ? this.isIncreasing.set(id)
      : this.isDecreasing.set(id);
    this.cartService.setUpdateUserCart(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartData.set(res);
        action === 'increase'
          ? this.isIncreasing.set(null)
          : this.isDecreasing.set(null);
      },
      error: (err) => {
        console.log(err);
        action === 'increase'
          ? this.isIncreasing.set(null)
          : this.isDecreasing.set(null);
      },
    });
  }

  deleteCartItem(id: string): void {
    this.cartService.setDeleteCartItem(id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Item Removed',
          detail: 'The item has been successfully removed from your cart.',
        });
        this.cartData.set(res);
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Deletion Failed',
          detail: 'There was an error removing the item. Please try again.',
        });
      },
    });
  }

  confirmDeleteItem(productID: string) {
    this.selectedProductID.set(productID!);
    this.confirmationService.confirm({
      header: 'Are you sure you want to delete this item?',
      message: 'Please confirm to proceed.',
      accept: () => {
        if (this.selectedProductID()) {
          this.deleteCartItem(this.selectedProductID());
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Action Cancelled',
          detail: 'The item remains in your cart.',
        });
      },
    });
  }

  clearUserCart(): void {
    this.cartService.setClearUserCart().subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cart Cleared',
          detail: 'All items have been successfully removed from your cart.',
        });
        this.cartData.set(res);
        this.cartService.cartNumber.set(0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Deletion Failed',
          detail: 'There was an error clearing cart Items. Please try again.',
        });
        console.log(err);
      },
    });
  }
  confirmClearCart() {
    this.confirmationService.confirm({
      header: 'Are you sure you want to delete all items?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.clearUserCart();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Action Cancelled',
          detail: 'Your cart remains unchanged.',
        });
      },
    });
  }

  getSimilerProducts(): void {
    this.categoryService.setGetProducts(undefined).subscribe({
      next: (res) => {
        this.similerProducts.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUserWishlist(): void {
    this.wishlistService.setGetWishlist().subscribe({
      next: (res) => {
        this.wishlistIds.set(res.data.map((element: any) => element.id));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toCheckout(): void {
    if (this.cartData()?.numOfCartItems) {
      this.router.navigate(['/checkout']);
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Action Cancelled',
        detail: 'Please Add item to your cart to proceed.',
      });
    }
  }
}
