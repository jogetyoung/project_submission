import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Applicant, Job, NO_APPLICANT } from '../models';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../service/job.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css'
})
export class ApplicationFormComponent implements OnInit {

  countries: string[]=[]
  private fb: FormBuilder = inject(FormBuilder)
  appForm!: FormGroup
  private jobSvc = inject(JobService)
  private router = inject(Router)

  @ViewChild('resumeUpload') 
  resumeUpload!: ElementRef

  @Input({ required: true })
  job!: Job

  applicant: Applicant = NO_APPLICANT
  invalidInsertMessage: string = ""

  ngOnInit(): void {
    this.getUserTopopulateForm()
    this.appForm = this.createApplicationForm(this.applicant)
  }

  getUserTopopulateForm(){
   let user = UserService.getUser()
  
   this.applicant = {
    id: user['id'],
    firstName: user['firstName'],
    lastName: user['lastName'],
    email: user['email']
   } 
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'firstName') {
      if (this.appForm.hasError('required', fieldName)) {
        return "First Name is required."
      }else if (this.appForm.hasError('minlength', fieldName)) {
        return "First Name must be at least 2 characters long."
      }
    } else if (fieldName === 'lastName') {
      if (this.appForm.hasError('required', fieldName)) {
        return "Last Name is required."
      }else if (this.appForm.hasError('minlength', fieldName)) {
        return "Last Name must be at least 2 characters long."
      }
    } else if (fieldName === 'email') {
      if (this.appForm.hasError('required', fieldName)) {
        return "Email is required."
      } else if (this.appForm.hasError('email', fieldName)) {
        return "Please enter a valid email."
      }
    } else if (fieldName === 'resume') {
      if (this.appForm.hasError('required', fieldName)) {
        return "Resume is required."
      }
    }
    return "";
  }

  createApplicationForm(app: Applicant): FormGroup {
    return this.fb.group({
      firstName: this.fb.control<string>(app.firstName, [Validators.required, Validators.minLength(2)]),
      lastName: this.fb.control<string>(app.lastName, [Validators.required, Validators.minLength(2)]),
      email: this.fb.control<string>(app.email, [Validators.required, Validators.email]),
      resume: this.fb.control<string>('', [Validators.required]),
    })
  }

  process() {
    let app = this.appForm.value
    const uploadedFile = this.resumeUpload.nativeElement.files[0]

    this.jobSvc.saveJobApplication(this.applicant, this.job, this.resumeUpload).then(res =>{
      this.router.navigate(['/applicant/application/success'])

    }).catch(err => {
      this.invalidInsertMessage = err.error.message
    })
  }

}
