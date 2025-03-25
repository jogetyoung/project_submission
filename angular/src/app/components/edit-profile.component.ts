import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../service/profile.service';
import { Applicant } from '../models';
import { Observable, startWith, switchMap } from 'rxjs';
import { CountryliststoreService } from '../stores/countrylist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  empForm!: FormGroup

  filteredOptions$!: Observable<string[]>;
  private filterStore = inject(CountryliststoreService)

  private profileSvc = inject(ProfileService)
  snackBar = inject(MatSnackBar)

  constructor(private dialogRef: MatDialogRef<EditProfileComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.empForm = this.formBuilder.group({
      id: [''], firstName: ['', Validators.required], lastName: ['', Validators.required],
      headline: [''], location: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data)
    this.filteredOptions$ = this.empForm.get('location')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.filterStore.makeOptList(value)))
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'firstName') {
      if (this.empForm.hasError('required', fieldName)) {
        return "First Name is required."
      }
    } else if (fieldName === 'lastName') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Last Name is required."
      }
    } else if (fieldName === 'location') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Location is required."
      } else if (this.empForm.hasError('minlength', fieldName)) {
        return "Location must be at least 2 characters long."
      }
    }
    return "";
  }

  onSubmit() {
    let app: Applicant = this.empForm.value
    this.profileSvc.updateAppProfile(app).then(resp => {
      if (resp['isAdded']) {
        this.snackBar.open("Successfully updated profile!", "Dismiss", {
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
