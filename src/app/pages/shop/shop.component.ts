import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Menu } from 'primeng/menu';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Slider } from 'primeng/slider';
import { CategoryService } from '../../core/services/category/category.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { MainTitleComponent } from '../../shared/components/main-title/main-title.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Categories } from './../../shared/interfaces/categories';

@Component({
  selector: 'app-shop',
  imports: [
    Breadcrumb,
    NgClass,
    NgIf,
    RouterLink,
    MainTitleComponent,
    AccordionModule,
    FormsModule,
    Slider,
    Menu,
    ProductCardComponent,
    PaginatorModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  @ViewChild('paginator') paginator!: Paginator;
  private readonly categoryService = inject(CategoryService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  links: MenuItem[] | undefined;
  sortOptions: MenuItem[] | undefined;
  rangeValues: WritableSignal<number[]> = signal([100, 45000]);
  categoryName: WritableSignal<string> = signal('All Products');
  categoryId: WritableSignal<string | undefined> = signal(undefined);
  categoriesList: WritableSignal<Categories[]> = signal([]);
  productList: WritableSignal<IProduct[]> = signal([]);
  productsNum: WritableSignal<number> = signal(0);
  sortOrder: WritableSignal<string> = signal('price');
  numberOfPages: WritableSignal<number> = signal(0);
  pageLinkSize: WritableSignal<number> = signal(5);
  wishlistIds: WritableSignal<string[]> = signal([]);
  loading: Signal<boolean> = computed(() => this.categoryService.contentload());

  first: number = 0;
  filterVisible: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.links = [{ label: 'Home', route: '/home' }, { label: 'Category' }];
    this.sortOptions = [
      {
        items: [
          {
            label: 'High to Low',
            icon: 'pi pi-sort-amount-down',
            command: () => this.sortProducts('-price'),
          },
          {
            label: 'Low to High',
            icon: 'pi pi-sort-amount-up',
            command: () => this.sortProducts('price'),
          },
        ],
      },
    ];
    this.getCategories();
    this.getProducts();
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.pageLinkSize.set(result.matches ? 3 : 5);
      });
    this.getUserWishlist();
  }

  getCategories(): void {
    this.categoryService.setGetCategory().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProducts(
    cateId?: string,
    minPrice?: number,
    maxPrice?: number,
    page?: number,
    sort?: string
  ): void {
    this.categoryService
      .setGetProductsWithLimit(cateId, minPrice, maxPrice, page, sort)
      .subscribe({
        next: (res) => {
          if (cateId) {
            const category = this.categoriesList().find(
              (item) => item._id === cateId
            );
            this.categoryName.set(category?.name!);
            this.categoryId.set(cateId);
          } else {
            this.categoryName.set('All Products');
            this.categoryId.set(undefined);
          }
          this.productList.set(res.data);
          this.productsNum.set(res.results);
          this.numberOfPages.set(res.metadata.numberOfPages);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        },
      });
  }

  sortProducts(sort: string): void {
    this.getProducts(
      this.categoryId(),
      this.rangeValues()[0],
      this.rangeValues()[1],
      undefined,
      sort
    );
    this.sortOrder.set(sort);
    this.paginator.changePage(0);
  }

  onPageChange(event: any): void {
    const page = event.page + 1;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.getProducts(
      this.categoryId(),
      this.rangeValues()[0],
      this.rangeValues()[1],
      page,
      this.sortOrder()
    );
  }

  resetPage(): void {
    this.paginator.first = 0;
  }
  resetRange(): void {
    this.rangeValues.set([100, 45000]);
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
}
