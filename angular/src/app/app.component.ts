import {Component, OnInit} from '@angular/core';
import {ResponsiveService} from "./service/responsive.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular';

  isMobile = false;

  constructor(private responsiveService: ResponsiveService) {}

  ngOnInit() {
    this.responsiveService.isMobile$.subscribe(mobile => {
      this.isMobile = mobile;
      if (mobile) {
        document.body.classList.add('mobile-view');
      } else {
        document.body.classList.remove('mobile-view');
      }
    });
  }
}
