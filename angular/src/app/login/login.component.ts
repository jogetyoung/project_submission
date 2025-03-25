import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Business, LoginUser } from '../models';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder)
  http: HttpClient = inject(HttpClient)
  private authSvc = inject(AuthenticationService)
  router: Router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  loginForm!: FormGroup
  isPasswordShown: boolean = true
  invalidLoginMessage: string = ""
  dispMsg: string =""

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userType: ["APPLICANT"],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    })
    this.applicantchecked()
  }

  isPasswordConditionMet(condition: string) {
    if (this.loginForm.get('password')?.hasError('required')) {
      return false
    }
    return !this.loginForm.get('password')!.hasError(condition)
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'email') {
      if (this.loginForm.hasError('required', fieldName)) {
        return "Email is required."
      } else if (this.loginForm.hasError('email', fieldName)) {
        return "Please enter a valid email."
      }
    } else if (fieldName === 'password') {
      if (this.loginForm.hasError('required', fieldName)) {
        return "Password is required."
      } else if (this.loginForm.hasError('minlength', fieldName)) {
        return "Password must be at least 8 characters long."
      }
    }
    return "";
  }

  applicantchecked(){
    this.dispMsg = "We connect skilled professionals with remote job opportunities globally. Join us in reshaping the future of work, where your skills are valued and nurtured on a global scale."
  }

  businesschecked(){
    this.dispMsg = "Our platform seamlessly connects talented professionals with remote job opportunities across the globe. Embrace the future of work with us and gain access to a pool of passionate, skilled individuals eager to collaborate with your team."
  }



  onLogin() {
    const values = this.loginForm.value

    let log: LoginUser = {
      email: values.email,
      password: values.password,
      role: values.userType
    }

    this.authSvc.loginUser(log).then(res => {

      if (res['role'] == "BUSINESS") {
        const user:Business = {
          id: res.id,
          company_email: res.email,
          company_name: res.officialName,
          premium: res.premium,
        };

        UserService.saveUser(user);
        UserService.saveToken(res['token']);

        this.router.navigate(['/business/listing-performance'])

      } else if (res['role'] == "APPLICANT") {

        const user = {
          id: res.id,
          email: res.email,
          firstName: res.firstName,
          lastName: res.lastName,
          headline: res.headline,
          location: res.location,
          resume: res.resume,
          profile_pic: res.profile_pic
        };

        UserService.saveUser(user);
        UserService.saveToken(res['token']);

        this.router.navigate(['/applicant/listings'])
      }
    }).catch(err => {
      if (err.status === 401) {
        this.invalidLoginMessage = "Invalid email or password. Please try again.";
      } else if (err.status === 404) {
        this.invalidLoginMessage = "Account not found. Please check your email or sign up.";
      } else {
        this.invalidLoginMessage = "Login failed. Please try again later.";
      }
      console.error("Login error:", err);    })
  }


}
