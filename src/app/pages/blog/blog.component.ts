import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { IBlog } from '../../shared/interfaces/iblog';

@Component({
  selector: 'app-blog',
  imports: [Breadcrumb, RouterModule, NgClass, NgIf, DatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  items: MenuItem[] | undefined;
  currentData: Date = new Date();

  blogs: IBlog[] = [
    {
      imageUrl: '/images/blog/blog-1.webp',
      genre: 'Fashion',
      CreatedAt: this.currentData,
      title: 'The perfect Shopify theme',
      description:
        'Shopify is the second most popular eCommerce store builder in the world. You can use Shopify in nearly every coun',
    },
    {
      imageUrl: '/images/blog/blog-2.webp',
      genre: 'Fashion',
      CreatedAt: this.currentData,
      title: 'The perfect Shopify theme',
      description:
        'Shopify is the second most popular eCommerce store builder in the world. You can use Shopify in nearly every coun',
    },
    {
      imageUrl: '/images/blog/blog-3.webp',
      genre: 'Fashion',
      CreatedAt: this.currentData,
      title: 'The perfect Shopify theme',
      description:
        'Shopify is the second most popular eCommerce store builder in the world. You can use Shopify in nearly every coun',
    },
    {
      imageUrl: '/images/blog/blog-4.webp',
      genre: 'Fashion',
      CreatedAt: this.currentData,
      title: 'The perfect Shopify theme',
      description:
        'Shopify is the second most popular eCommerce store builder in the world. You can use Shopify in nearly every coun',
    },
    {
      imageUrl: '/images/blog/blog-5.webp',
      genre: 'Fashion',
      CreatedAt: this.currentData,
      title: 'The perfect Shopify theme',
      description:
        'Shopify is the second most popular eCommerce store builder in the world. You can use Shopify in nearly every coun',
    },
    {
      imageUrl: '/images/blog/blog-6.webp',
      genre: 'Fashion',
      CreatedAt: this.currentData,
      title: 'The perfect Shopify theme',
      description:
        'Shopify is the second most popular eCommerce store builder in the world. You can use Shopify in nearly every coun',
    },
  ];
  ngOnInit(): void {
    this.items = [{ label: 'Home', route: '/home' }, { label: 'Blog' }];
  }
}
