import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Applicant, Business, LoginUser } from '../models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }
  baseUrl: string = environment.server_url
  jwtHelper: JwtHelperService = inject(JwtHelperService)

  private http = inject(HttpClient)

  //register new user
  signupUser(user: Applicant){
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/api/auth/applicant-signup`, user)
    )
  }

  signupBusiness(user: Business){
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/api/auth/business-signup`, user)
    )
  }

  loginUser(user: LoginUser) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/api/auth/login`, user)
    )
  }

  //get JWT access token from storage
  getAccessToken(): string | null {
    return localStorage.getItem("token")
  }

  //authentication check
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    if (token === null) {
      return false
    }

    //has token expired?
    if (this.jwtHelper.isTokenExpired(token)) {
      this.clearToken()
      return false
    }

    return true
  }

  //role of token, for applicant or for a business?
  getTokenRole(): string | null {
    const token = this.getAccessToken()
    if (!token) {
      return null;
    }

    return this.jwtHelper.decodeToken(token).role
  }

  //premium status token for businesses
  getTokenPremium(): boolean | null {
    const token = this.getAccessToken()
    if (!token) {
      return null;
    }

    return this.jwtHelper.decodeToken(token).premium
  }

  getTokenId(): string | null {
    const token = this.getAccessToken()
    if (!token) {
      return null;
    }

    return this.jwtHelper.decodeToken(token).id
  }

  //token is cleared once log out
  clearToken(): void {
    localStorage.removeItem("token")
  }

  updateBizPremiumStatus(id: any){
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/auth/update/${id}`))
  }



}
