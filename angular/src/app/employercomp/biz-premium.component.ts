import { Component, OnInit, inject } from '@angular/core';
import { PaymentService } from '../service/payment.service';
import { Router } from '@angular/router';
import { Business, PaymentInfo } from '../models';
import { UserService } from '../service/user.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-biz-premium',
  templateUrl: './biz-premium.component.html',
  styleUrl: './biz-premium.component.css'
})
export class BizPremiumComponent implements OnInit {

  ngOnInit(): void {
  }

  router = inject(Router)
  paymentService = inject(PaymentService)
  business!: Business

  authSvc = inject(AuthenticationService)

  proceedToPayment() {
    let urls: PaymentInfo = {
      successUrl: 'premium-success',
      cancelUrl: 'premium-cancel'
    }
    this.paymentService.goToPayment(urls).then(res => {

    }).catch(err => {
      console.log(">> PremiumPayment: Error occurred" + err)
    })
  }

  goback(){
    window.history.back();
  }


}
