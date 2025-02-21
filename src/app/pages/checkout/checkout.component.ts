import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { IAddress } from '../../shared/interfaces/iaddress';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-checkout',
  imports: [
    Breadcrumb,
    RouterModule,
    NgClass,
    NgIf,
    DatePipe,
    FormsModule,
    Dialog,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  visible: boolean = false;
  items: MenuItem[] | undefined;
  cartData: WritableSignal<ICart | null> = signal<ICart | null>(null);
  currentDate: Date = new Date();
  twoDaysLater: Date = new Date();
  selectedAddress: any = null;
  addresses: IAddress[] = [];
  ngOnInit(): void {
    this.twoDaysLater.setDate(this.currentDate.getDate() + 2);

    this.items = [
      { label: 'Home', route: '/home' },
      { label: 'Category', route: '/shop' },
      { label: 'Cart', route: '/cart' },
      { label: 'Checkout' },
    ];
    this.getUserCart();
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

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
