import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  router = inject(Router)
  authService = inject(AuthenticationService)

  @Input() 
  isLogoutDisabled: boolean = false

  logo!: string

  goHome() {
    this.router.navigate(['/applicant/listings'])
  }

  logout() {
    this.authService.clearToken()
    this.router.navigate(['/'])
  }


  ngOnInit() {
  }



}
