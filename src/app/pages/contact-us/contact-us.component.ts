import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-contact-us',
  imports: [Breadcrumb, RouterModule, NgClass, NgIf, Checkbox],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  items: MenuItem[] | undefined;
  ngOnInit(): void {
    this.items = [{ label: 'Home', route: '/home' }, { label: 'Contact Us' }];
  }
}
