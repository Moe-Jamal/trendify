import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Toast, ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-wishlist',
  imports: [
    DataView,
    ButtonModule,
    CommonModule,
    Toast,
    ConfirmDialog,
    ToastModule,
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class WishlistComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  products = signal<any>([]);
  isloading: WritableSignal<string> = signal('');
  selectedProductID: WritableSignal<string> = signal('');
  wishlistData: WritableSignal<IProduct[] | null> = signal(null);
  ngOnInit() {
    this.getUserWishlist();
  }

  getSeverity(product: any) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }

  addToCart(id: string): void {
    this.isloading.set(id);
    this.cartService.setAddToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.messageService.add({
          severity: 'success',
          summary: 'Product Added',
          detail: res.message,
        });
        this.deleteWishlistItem(id);
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

  deleteWishlistItem(id: string): void {
    this.wishlistService.setRemoveWishlist(id).subscribe({
      next: (res) => {
        this.getUserWishlist();
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Deletion Failed',
          detail: 'There was an error removing the item. Please try again.',
        });
        this.isloading.set('');
      },
    });
  }

  getUserWishlist(): void {
    this.wishlistService.setGetWishlist().subscribe({
      next: (res) => {
        this.wishlistService.wishlistCount.set(res.count);
        this.wishlistData.set(res.data);
        this.isloading.set('');
      },
      error: (err) => {
        console.log(err);
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
          this.deleteWishlistItem(this.selectedProductID());
          this.messageService.add({
            severity: 'success',
            summary: 'Item Removed',
            detail:
              'The item has been successfully removed from your wishlist.',
          });
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Action Cancelled',
          detail: 'The item remains in your wishlist.',
        });
      },
    });
  }
}
