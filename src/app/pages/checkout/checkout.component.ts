import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CartService } from '../../core/services/cart/cart.service';
import { IAddress } from '../../shared/interfaces/iaddress';
import { ICart } from '../../shared/interfaces/icart';
import { SelectButton } from 'primeng/selectbutton';
import { Message } from 'primeng/message';
import { AdressService } from '../../core/services/adress/adress.service';
import { Toast } from 'primeng/toast';
import { OrdersService } from '../../core/services/orders/orders.service';
import { error } from 'console';

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
    SelectModule,
    FloatLabel,
    TextareaModule,
    SelectButton,
    ReactiveFormsModule,
    Message,
    Toast,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly adressService = inject(AdressService);
  private readonly messageService = inject(MessageService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  visible: boolean = false;
  items: MenuItem[] | undefined;
  cartData: WritableSignal<ICart | null> = signal<ICart | null>(null);
  cartId: WritableSignal<string> = signal('');
  currentDate: Date = new Date();
  twoDaysLater: Date = new Date();
  addresses: WritableSignal<IAddress[]> = signal([]);
  selectedAddress: WritableSignal<IAddress | null> = signal(null);
  shippingMethod: WritableSignal<string> = signal('Free');
  paymentMethod: WritableSignal<string> = signal('online');
  countries: any[] | undefined;
  stateOptions: any[] = [
    { label: 'Home', value: 'Home' },
    { label: 'Office', value: 'Office' },
  ];
  selectedCountry: string | undefined;
  deleteLoading: WritableSignal<string> = signal('');
  newAddress: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    details: [null, [Validators.required]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],
    city: [Validators.required],
  });
  ngOnInit(): void {
    this.twoDaysLater.setDate(this.currentDate.getDate() + 2);

    this.items = [
      { label: 'Home', route: '/home' },
      { label: 'Category', route: '/shop' },
      { label: 'Cart', route: '/cart' },
      { label: 'Checkout' },
    ];
    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' },
    ];
    this.getUserCart();
    this.getUserAddress();
  }

  getUserCart(): void {
    this.cartService.setGetUserCart().subscribe({
      next: (res) => {
        this.cartData.set(res);
        this.cartId.set(res.cartId);
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
    this.newAddress.reset();
  }

  getUserAddress(): void {
    this.adressService.getLoggedUserAdress().subscribe({
      next: (res) => {
        this.addresses.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    if (this.newAddress.valid) {
      this.adressService.setAddAdress(this.newAddress.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Address Added',
            detail: 'Your address has been added successfully!',
          });
          this.addresses.set(res.data);
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to Add Address',
            detail:
              'An error occurred while adding your address. Please try again.',
          });
        },
      });
      this.closeDialog();
    } else {
      this.newAddress.markAllAsTouched();
    }
  }

  deleteUserAddress(addressId: string): void {
    this.deleteLoading.set(addressId);
    this.adressService.setRemoveAdress(addressId).subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        this.messageService.add({
          severity: 'success',
          summary: 'Address Removed',
          detail: 'Your address has been removed successfully!',
        });
        this.deleteLoading.set('');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Remove Address',
          detail:
            'An error occurred while removing your address. Please try again.',
        });
        console.log(err);
        this.deleteLoading.set('');
      },
    });
  }

  placeOrder(): void {
    const address = {
      details: this.selectedAddress()?.details,
      phone: this.selectedAddress()?.phone,
      city: this.selectedAddress()?.city,
    };
    if (!this.selectedAddress()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Select Address',
        detail: 'Please select an address before proceeding!',
      });
    } else {
      if (this.paymentMethod() === 'online') {
        this.ordersService.setOnlineOrder(this.cartId(), address).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              open(res.session.url, '_self');
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.ordersService.setCashOrder(this.cartId(), address).subscribe({
          next: (res) => {
            console.log(res);
            this.router.navigate(['/allorders']);
            this.cartService.cartNumber.set(0);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
}
