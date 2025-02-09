import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-footer',
  imports: [AccordionModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}
  isDesktop: boolean = true;
  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    this.cheackScreenSize();
  }
  cheackScreenSize() {
    if (this.isBrowserOnly) {
      if (window.innerWidth < 1024) {
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
      }
    }
  }
  @HostListener('window:resize', [])
  desktopMode(): void {
    this.cheackScreenSize();
  }
}
