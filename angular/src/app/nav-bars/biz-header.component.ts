import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';
import { Business } from '../models';

@Component({
  selector: 'app-biz-header',
  templateUrl: './biz-header.component.html',
  styleUrl: './biz-header.component.css'
})
export class BizHeaderComponent implements OnInit {
  ngOnInit(): void {
    this.checkPremium()
  }

  router = inject(Router)
  authService = inject(AuthenticationService)

  @Input()
  isLogoutDisabled: boolean = false
  business!: Business
  logo!: string
  isPremium:boolean | undefined = false

  goHome() {
    this.router.navigate(['/business/listing-performance'])
  }

  checkPremium() {
    let user = UserService.getUser()
    this.business = {
      id: user['id'],
      company_name: user['company_name'],
      company_email: user['company_email'],
      premium: user['premium']
    }

    this.isPremium = this.business.premium
  }

  logout() {
    this.authService.clearToken()
    this.router.navigate(['/'])
  }


}
