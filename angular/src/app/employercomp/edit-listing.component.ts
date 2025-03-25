import { Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job } from '../models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BizJobService } from '../service/biz.job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewService } from '../service/view.service';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrl: './edit-listing.component.css'
})
export class EditListingComponent implements OnInit {

  allCountries: string[] = ViewService.allcountries
  defaultTags: string[] = ViewService.defaultTags
  empForm!: FormGroup
  filteredOptions$!: Observable<string[]>;
  tagfilteredOptions$!: Observable<string[]>;
  jobtypes: string[] = ['Full Time', 'Contract', 'Part Time', 'Internship', 'Freelance']
  private bizJobSvc = inject(BizJobService)

  @ViewChild('countryInput')
  countryInput!: ElementRef
  selectedCountries: string[] = []

  @ViewChild('tagInput')
  tagInput!: ElementRef
  selectedTags: string[] = []
  snackBar = inject(MatSnackBar)

  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodesTags: number[] = [ENTER, COMMA];
  invalidSaveMessage: string = ""

  constructor(private dialogRef: MatDialogRef<EditListingComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Job) {
    this.empForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      candidate_required_location: ([]),
      tags: ([]),
      description: ['', Validators.required],
      job_type: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data)

    if (this.data.candidate_required_location.length >0){
      this.data.candidate_required_location.forEach(location => {
        this.selectedCountries.push(location);
      });
    }
    if (this.data.tags.length >0){
      this.data.tags.forEach(location => {
        this.selectedTags.push(location);
      });
    }

    this.filteredOptions$ = this.empForm.get('candidate_required_location')!.valueChanges.pipe(
      startWith(''),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allCountries.slice())),
    )

    this.tagfilteredOptions$ = this.empForm.get('tags')!.valueChanges.pipe(
      startWith(''),
      map((fruit: string | null) => (fruit ? this._tagfilter(fruit) : this.defaultTags.slice())),
    )
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'title') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Title is required."
      } else if (this.empForm.hasError('minlength', fieldName)) {
        return "Title must be at least 3 characters long."
      }
    } else if (fieldName === 'job_type') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Job Type is required."
      }
    } else if (fieldName === 'description') {
      if (this.empForm.hasError('required', fieldName)) {
        return "Job description is required."
      }
    }
    return "";
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCountries.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  private _tagfilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.defaultTags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    const selectedValue = event.option.viewValue;

    if (!this.selectedCountries.includes(selectedValue)) {
      this.selectedCountries.push(selectedValue);
    }

    this.countryInput.nativeElement.value = '';
    this.empForm.get('candidate_required_location')?.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedCountries.includes(value)) {
      this.selectedCountries.push(value);
    }

    event.chipInput!.clear();
    this.empForm.get('candidate_required_location')?.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.selectedCountries.indexOf(fruit);

    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;

    if (!this.selectedTags.includes(selectedValue)) {
      this.selectedTags.push(selectedValue);
    }

    this.tagInput.nativeElement.value = '';
    this.empForm.get('tags')?.setValue(null);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedTags.includes(value)) { this.selectedTags.push(value); }

    event.chipInput!.clear();
    this.empForm.get('tags')?.setValue(null);
  }

  removeTag(fruit: string): void {
    const index = this.selectedTags.indexOf(fruit);
    if (index >= 0) { this.selectedTags.splice(index, 1); }
  }

  process() {
    let app: Job = this.empForm.value
    app.candidate_required_location = this.selectedCountries
    
    if(this.selectedCountries.length ===0){
      this.selectedCountries.push("Worldwide");
      app.candidate_required_location = this.selectedCountries
    }

    this.bizJobSvc.updateJob(app).then(res => {
      if (res['isUpdated']) {
        this.snackBar.open("Successfully updated job listing!", "Dismiss", {
          duration: 20000
        })
        this.empForm.reset
        this.dialogRef.close()
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 20000
        })
      }
    })
      .catch(err => {
        this.invalidSaveMessage = err.error.message
      })
  }

  close() {
    this.dialogRef.close() 
  }

  removepost(){
    this.bizJobSvc.removePost(this.data.id).then(res => {
      if (res['isUpdated']) {
        this.snackBar.open("Successfully deleted job listing", "Dismiss", {
          duration: 20000
        })
        this.empForm.reset
        this.dialogRef.close()
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 20000
        })
      }
    })
  }

}
