import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  static saveToken(token: string): void {
    window.localStorage.removeItem("token");
    window.localStorage.setItem("token", token);
  }

  static saveUser(user: any): void { 
    window.localStorage.removeItem("user");
    window.localStorage.setItem("user", JSON.stringify(user));
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static getUser(): any {
    const user = localStorage.getItem("user")

    if (user === null) {
      return Promise.resolve()
    }
    return JSON.parse(user);
  }


}
