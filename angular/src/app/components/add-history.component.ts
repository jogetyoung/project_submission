import { Component, Inject, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { CountryliststoreService } from '../stores/countrylist.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../service/profile.service';
import { Applicant, Employment } from '../models';
import { ViewService } from '../service/view.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrl: './add-history.component.css'
})
export class AddHistoryComponent implements OnInit {

  empForm!: FormGroup
  countries!: Observable<string[]>;
  months: string[] = ViewService.getMonths()
  years: string[] = ViewService.getYears()

  filteredOptions$!: Observable<string[]>;
  private filterStore = inject(CountryliststoreService) 

  private profileSvc = inject(ProfileService)
  isCurrentRole: boolean = false
  snackBar = inject(MatSnackBar)
  jobtypes: string[] = ['Full Time', 'Contract', 'Part Time', 'Internship', 'Freelance']
  locationtype: string[] = ['On-site', 'Hybrid', 'Remote']

  constructor(private dialogRef: MatDialogRef<AddHistoryComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.empForm = this.createForm()
    this.filteredOptions$ = this.empForm.get('location')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.filterStore.makeOptList(value)))

    this.addEndYearValidator()
    this.addCustomValidators()
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      title: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(3)]),
      company: this.formBuilder.control<string>('', [Validators.required]),
      job_description: this.formBuilder.control<string>(''),
      location: this.formBuilder.control<string>('', [Validators.required]),
      job_type: this.formBuilder.control<string>('', [Validators.required]),
      location_type: this.formBuilder.control<string>('', [Validators.required]),
      start_month: this.formBuilder.control<string>('', [Validators.required]),
      start_year: this.formBuilder.control<string>('', [Validators.required]),
      current_role: this.formBuilder.control<boolean>(false),
      end_month: this.formBuilder.control<string>('', [Validators.required]),
      end_year: this.formBuilder.control<string>('', [Validators.required])
    })
  }

  addEndYearValidator() {
    this.empForm.get('start_year')?.valueChanges.subscribe(() => {
      this.empForm.get('end_year')?.setValidators(this.validateEndYear.bind(this));
      this.empForm.get('end_year')?.updateValueAndValidity();
    });
  }

  validateEndYear(control: AbstractControl): ValidationErrors | null {
    const startYear = parseInt(this.empForm.get('start_year')?.value, 10);
    const endYear = parseInt(control.value, 10);
    if (endYear < startYear) {
      return { endYearBeforeStartYear: true };
    }
    return null;
  }

  addCustomValidators() {
    this.empForm.get('start_year')?.valueChanges.subscribe(() => {
      this.updateEndMonthValidator();
    });
    this.empForm.get('start_month')?.valueChanges.subscribe(() => {
      this.updateEndMonthValidator();
    });

    this.empForm.get('end_year')?.valueChanges.subscribe(() => {
      this.updateEndMonthValidator();
    });
    this.empForm.get('end_month')?.valueChanges.subscribe(() => {
      this.updateEndMonthValidator();
    });
  }

  updateEndMonthValidator() {
    const startYear = parseInt(this.empForm.get('start_year')?.value, 10);
    const startMonth = this.empForm.get('start_month')?.value;
    const endYear = parseInt(this.empForm.get('end_year')?.value, 10);
    const endMonth = this.empForm.get('end_month')?.value;

    if (startYear === endYear && this.months.indexOf(startMonth) > this.months.indexOf(endMonth)) {
      this.empForm.get('end_month')?.setErrors({ endMonthBeforeStartMonth: true })
    } else {
      this.empForm.get('end_month')?.setErrors(null);
    }
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'title') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Title is required."
      } else if (this.empForm.hasError('minlength', fieldName)) {
        return "Title must be at least 3 characters long."
      }
    } else if (fieldName === 'company') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Company Name is required."
      } 
    } else if (fieldName === 'location') { 
      if (this.empForm.hasError('required', fieldName)) {
        return "Location is required."
      } 
    } else if (fieldName === 'job_type') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Job Type is required."
      } 
     } else if (fieldName === 'location_type') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Location Type is required."
      } 
    } 
    else if (fieldName === 'start_month') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Start period is required."
      } 
    } else if (fieldName === 'start_year') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Start period is required."
      } 
    } else if (fieldName === 'end_month') {
      if (this.empForm.hasError('required', fieldName)) {
        return "If this is not your current employment, End period is required."
      } else if (this.empForm.hasError('endMonthBeforeStartMonth', fieldName)) {
        return "End month cannot be less than start month if year is same"
      }
    }else if (fieldName === 'end_year') {
      if (this.empForm.hasError('required', fieldName)) {
        return "If this is not your current employment, End period is required."
      } else if (this.empForm.hasError('endYearBeforeStartYear', fieldName)) {
        return "End year cannot be less than start year."
      }
    }
    return "";
  }

  checked(checkbox: any) {
    this.isCurrentRole = checkbox.target.checked

    const endMonthControl = this.empForm.get('end_month');
    const endYearControl = this.empForm.get('end_year');

    if (endMonthControl && endYearControl) {
      if (this.isCurrentRole) {
        endMonthControl.disable();
        endYearControl.disable();

        endMonthControl.clearValidators();
        endYearControl.clearValidators();
      } else {
        endMonthControl.enable();
        endYearControl.enable();

        endMonthControl.setValidators([Validators.required]);
        endYearControl.setValidators([Validators.required]);
      }

      endMonthControl.updateValueAndValidity();
      endYearControl.updateValueAndValidity();
    }
  }

  onSubmit() {
    let app: Applicant = this.data
    let values: Employment = this.empForm.value

    this.profileSvc.updateEmployment(app, values).then(resp => {
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
