import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CategorySliderComponent } from './components/category-slider/category-slider.component';
import { HomeSliderComponent } from './components/home-slider/home-slider.component';
import { MainTitleComponent } from '../../shared/components/main-title/main-title.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CategoryService } from '../../core/services/category/category.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ChangeDetectorRef } from '@angular/core';
import { Categories } from '../../shared/interfaces/categories';
import { IBrand } from '../../shared/interfaces/ibrand';

@Component({
  selector: 'app-home',
  imports: [
    CategorySliderComponent,
    HomeSliderComponent,
    MainTitleComponent,
    ProductCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);
  allProducts: IProduct[] = [];
  specificProducts: IProduct[] = [];
  allBrands: IBrand[] = [];
  selectedCategoryId: string | null = null;

  categories = [
    { name: 'All', id: null },
    { name: "Men's Fashion", id: '6439d5b90049ad0b52b90048' },
    { name: "Women's Fashion", id: '6439d58a0049ad0b52b9003f' },
    { name: 'Electronics', id: '6439d2d167d9aa4ca970649f' },
  ];

  ngOnInit(): void {
    this.getProductsData();
    this.getCateProductsData(undefined);
    this.getAllBrands();
  }

  getProductsData(): void {
    this.categoryService.setGetProducts().subscribe({
      next: (res) => {
        this.allProducts = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCateProductsData(id: any): void {
    this.categoryService.setGetProducts(id).subscribe({
      next: (res) => {
        this.specificProducts = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCategoryData(): void {
    this.categoryService.setGetCategory().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllBrands(): void {
    this.categoryService.setGetBrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.allBrands = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  setCateId(id: any): void {
    this.selectedCategoryId = id;
    this.getCateProductsData(id);
  }
}
