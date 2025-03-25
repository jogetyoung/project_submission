import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { Business } from '../models';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  // AfterViewInit

  router = inject(Router)
  authSvc = inject(AuthenticationService)
  business!: Business

  ngOnInit(): void {
    let user = UserService.getUser()

    this.business = {
      id: user['id'],
      company_name: user['company_name'],
      company_email: user['company_email'],
      premium: user['premium']
    }

    this.authSvc.updateBizPremiumStatus(this.business.id).then(res => {
      this.authSvc.clearToken()
    })

  }

  redirect(){
    this.router.navigate(['/']);
  }

}
