import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SideNavRoute } from '../models';

@Component({
  selector: 'app-side-nav-list',
  templateUrl: './side-nav-list.component.html',
  styleUrl: './side-nav-list.component.css'
})
export class SideNavListComponent implements OnInit{
  @Input() isMenuShown: boolean = true;
  @Input() sideNavRoutes: SideNavRoute[] = []

  @Output() toggleMenu = new EventEmitter();

  selectedItem: string = ''

  ngOnInit(): void {
    this.selectedItem = this.sideNavRoutes[0].route
  }

  changeSelection(route: string) {
    this.selectedItem = route
  }

  clearNotification(sideNavRoute: any) {
      sideNavRoute.notification = false;
  }
}
