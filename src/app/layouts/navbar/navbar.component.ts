import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    Menu,
    ButtonModule,
    RouterLinkActive,
    OverlayBadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/home';
        this.isProductPage = this.router.url.includes('/product-details/');
        this.checkScroll();
      }
    });
  }
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  items: MenuItem[] | undefined;
  userName: string = '';
  isMenuOpen: boolean = false;
  isHomePage: boolean = false;
  isProductPage: boolean = false;
  isScrolled: boolean = false;
  menuHeight = 0;
  countCart: Signal<number> = computed(() => this.cartService.cartNumber());
  navLinks = [
    {
      name: 'Home',
      path: '/home',
    },
    {
      name: 'Products',
      path: '/shop',
    },
    {
      name: 'About us',
      path: '/about',
    },
    {
      name: 'Blog',
      path: '/blog',
    },
    {
      name: 'Contact Us',
      path: '/contact-us',
    },
  ];
  ngOnInit() {
    this.authService.saveUserData();
    this.userName = this.authService.userData!.name;
    this.items = [
      {
        label: this.userName,
        items: [
          {
            label: 'Orders',
            icon: 'pi pi-history',
            routerLink: ['/orders'],
          },
          {
            label: 'Change Password',
            icon: 'pi pi-user-edit',
            routerLink: ['/change-password'],
          },
          {
            label: 'LogOut',
            icon: 'pi pi-sign-out',
            command: () => this.authService.logout(),
          },
        ],
      },
    ];
    this.cartService.setGetUserCart().subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.menuHeight = this.mobileMenu.nativeElement.scrollHeight;
    } else {
      this.menuHeight = 0;
    }
  }
  closeMenu() {
    this.isMenuOpen = false;
    this.menuHeight = 0;
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    if (this.isHomePage) {
      this.isScrolled = window.scrollY > window.innerHeight;
    } else {
      this.isScrolled = true;
    }
  }
}
