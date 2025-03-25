import { HttpClient } from '@angular/common/http';
import { Injectable, inject, model } from '@angular/core';
import { stripeenvironment } from '../stripeenvironment';
import { loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { PaymentInfo } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }
  
  baseUrl: string = environment.server_url
  http = inject(HttpClient)
  stripePromise = loadStripe(stripeenvironment.stripeApiKey) 

  async goToPayment(urls: PaymentInfo){

    const stripe = await this.stripePromise
    firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/checkout`, urls)).then(res => {
      console.log(res)
      // console.log("SESSION ID", res['sessionId'])
      const sessionId = res.sessionId;
      // console.log("SESSION ID", sessionId)

      stripe?.redirectToCheckout({ sessionId });
    }).catch(err => {
      console.log(err)
    })
  }
}
