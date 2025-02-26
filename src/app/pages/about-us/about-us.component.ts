import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-about-us',
  imports: [Breadcrumb, RouterModule, NgClass, NgIf],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  items: MenuItem[] | undefined;
  ngOnInit(): void {
    this.items = [{ label: 'Home', route: '/home' }, { label: 'About Us' }];
  }
}
