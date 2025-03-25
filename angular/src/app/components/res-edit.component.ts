import { Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { Applicant } from '../models';
import { PicEditComponent } from './pic-edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../service/profile.service';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-res-edit',
  templateUrl: './res-edit.component.html',
  styleUrl: './res-edit.component.css'
})
export class ResEditComponent implements OnInit {

  @ViewChild('resumeUpload')
  resumeUpload!: ElementRef
  snackBar = inject(MatSnackBar)
  empForm!: FormGroup
  private profileSvc = inject(ProfileService)
  applicant!: Applicant

  constructor(private dialogRef: MatDialogRef<PicEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.applicant = this.data
  }

  onSubmit() {
    this.profileSvc.updateAppProfileRes(this.applicant, this.resumeUpload).then (res =>{

      const user = {
        id: this.applicant.id,
        email: this.applicant.email,
        firstName: this.applicant.firstName,
        lastName: this.applicant.lastName,
        headline: this.applicant.headline,
        location: this.applicant.location,
        resume: this.applicant.resume,
        profile_pic: res['url']
      };
      
      UserService.saveUser(user);

      if (res['isUpdated']) {
        this.snackBar.open("Successfully updated resume!", "Dismiss", {
          duration: 5000
        })
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        })
      }
      this.dialogRef.close()
    })
  }

}
