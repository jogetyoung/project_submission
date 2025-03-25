import { Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../service/profile.service';
import { Applicant } from '../models';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pic-edit',
  templateUrl: './pic-edit.component.html',
  styleUrl: './pic-edit.component.css'
})
export class PicEditComponent implements OnInit {

  @ViewChild('profilePicUpload')
  profilePicUpload!: ElementRef
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
    this.profileSvc.updateAppProfilePic(this.applicant, this.profilePicUpload).then (res =>{
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

      if (res['isUpdated']) {
        this.snackBar.open("Successfully updated profile picture!", "Dismiss", {
          duration: 5000
        })
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        })
      }
      
      UserService.saveUser(user);
      this.dialogRef.close()
    })
  }

}
