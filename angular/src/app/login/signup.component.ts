import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  fb = inject(FormBuilder)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  signupForm!: FormGroup

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userType: ["APPLICANT"]
    })
  }

  onUserTypeChanged() {
    if (this.signupForm.get('userType')!.value === "APPLICANT") {
      this.router.navigate(['/applicant-signup'])
    } else if (this.signupForm.get('userType')!.value === "BUSINESS") {
      this.router.navigate(['/business-signup'])
    }
  }

}
