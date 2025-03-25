import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../service/authentication.service';
import { passwordValidator } from './password.validator';

@Component({
  selector: 'app-business-signup',
  templateUrl: './business-signup.component.html',
  styleUrl: './business-signup.component.css'
})
export class BusinessSignupComponent implements OnInit{

  signupService = inject(AuthenticationService)
  fb = inject(FormBuilder)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  snackBar = inject(MatSnackBar)

  signupForm!: FormGroup
  isPasswordShown: boolean = true
  invalidLoginMessage: string = ""

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      officialName:["", Validators.required],
      email:["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), passwordValidator]],
    })
  }

  togglePasswordShown() {
    this.isPasswordShown = !this.isPasswordShown;
  }

  isPasswordConditionMet(condition: string) {
    if (this.signupForm.get('password')?.hasError('required')) {
      return false
    }
    return !this.signupForm.get('password')!.hasError(condition)
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'email') {
      if (this.signupForm.hasError('required', fieldName)) {
        return "Email is required."
      } else if (this.signupForm.hasError('email', fieldName)) {
        return "Please enter a valid email."
      }
    } else if (fieldName === 'officialName') {
      if (this.signupForm.hasError('required', fieldName)) {
        return "Company name is required."
      }
    }
    return "";
  }

  onSignup() {
    const signupFormValue = this.signupForm.value

    this.signupService.signupBusiness({
      company_name: signupFormValue.officialName,
      company_email: signupFormValue.email,
      password: signupFormValue.password,
      premium: false
    }).then(res => {
      if (res['isAdded']) {
        this.snackBar.open("Successfully registered! You may now log in.", "Dismiss", {
          duration: 5000
        })
        this.router.navigate(['/'])
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        })
      }
    }).catch(err => {
      this.invalidLoginMessage = err.error.message
    })
  }

}
