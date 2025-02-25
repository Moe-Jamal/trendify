import { NgClass, NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IOrder } from '../../../shared/interfaces/iorder';

@Component({
  selector: 'app-allorders',
  imports: [Breadcrumb, NgClass, NgIf, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  links: MenuItem[] | undefined;
  ordersData: WritableSignal<IOrder[] | undefined> = signal(undefined);
  userId: string | undefined = this.authService.userData?.id;
  ngOnInit(): void {
    this.links = [{ label: 'Home', route: '/home' }, { label: 'Orders' }];
    this.getUserOrders(this.userId!);
  }

  getUserOrders(userId: string): void {
    this.ordersService.getUserOrders(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.ordersData.set(res.reverse());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
