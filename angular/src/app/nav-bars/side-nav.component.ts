import { Component, Input, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SideNavRoute } from '../models';
import {ResponsiveService} from "../service/responsive.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit{

  router = inject(Router)
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = false;

  @Input()
  sideNavRoutes: SideNavRoute[] = []

  isMenuExpanded: boolean = true

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        event.urlAfterRedirects.split('/').pop()
      }
    });

    // Detect mobile screens
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches;
        // Keep the menu visible but collapsed on mobile
        if (this.isMobile) {
          this.isMenuExpanded = false;
        }
      });

  }

  toggleMenu() {
    this.isMenuExpanded = !this.isMenuExpanded;
  }

}
