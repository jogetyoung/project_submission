import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../service/authentication.service';
import { passwordValidator } from './password.validator';

@Component({
  selector: 'app-applicant-signup',
  templateUrl: './applicant-signup.component.html',
  styleUrl: './applicant-signup.component.css'
})
export class ApplicantSignupComponent implements OnInit {
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
      firstName:["", [Validators.required]],
      lastName:["", [Validators.required]],
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
    } else if (fieldName === 'firstName') {
      if (this.signupForm.hasError('required', fieldName)) {
        return "First name is required."
      }
    } else if (fieldName === 'lastName') {
      if (this.signupForm.hasError('required', fieldName)) {
        return "Last name is required."
      }
    }
    return "";
  }


  onSignup() {
    const signupFormValue = this.signupForm.value

    this.signupService.signupUser({
      firstName: signupFormValue.firstName,
      lastName: signupFormValue.lastName,
      email: signupFormValue.email,
      password: signupFormValue.password
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
