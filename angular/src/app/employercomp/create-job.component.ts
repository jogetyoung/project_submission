import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, JobPost } from '../models';
import { BizJobService } from '../service/biz.job.service';
import { ViewService } from '../service/view.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../service/user.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.css'
})
export class CreateJobComponent implements OnInit {

  allCountries: string[] = ViewService.allcountries
  private fb: FormBuilder = inject(FormBuilder)
  postingForm!: FormGroup
  defaultTags: string[] = ViewService.defaultTags

  jobtypes: string[] = ['Full Time', 'Contract', 'Part Time', 'Internship', 'Freelance']

  @ViewChild('resumeUpload') 
  resumeUpload!: ElementRef

  private bizJobSvc = inject(BizJobService)
  filteredOptions$!: Observable<string[]>;
  tagfilteredOptions$!: Observable<string[]>;

  @ViewChild('quillEditor') quillEditor!: ElementRef;
  defaultContent: string = `
<p style="min-height:1.5em"><strong>About this role:</strong></p>
<p style="min-height:1.5em"></p>

<p style="min-height:1.5em"></p>
<p style="min-height:1.5em"><strong>Key Responsibilities:</strong></p>
<ul>
    <li><p style="min-height:1.5em"></p></li>
    <li><p style="min-height:1.5em"></p></li>
    <li><p style="min-height:1.5em"></p></li>
    <li><p style="min-height:1.5em"></p></li>
</ul>
<p style="min-height:1.5em"></p>
<p style="min-height:1.5em"><strong>Qualifications:</strong></p>
<ul>
    <li><p style="min-height:1.5em"></p></li>
    <li><p style="min-height:1.5em"></p></li>
    <li><p style="min-height:1.5em"></p></li>
</ul>`;
  invalidSaveMessage: string = ""
  snackBar = inject(MatSnackBar)

  business!: Business

  @ViewChild('countryInput')
  countryInput!: ElementRef
  selectedCountries: string[] = []

  @ViewChild('tagInput')
  tagInput!: ElementRef
  selectedTags: string[] = []

  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodesTags: number[] = [ENTER, COMMA];

  ngOnInit(): void {
    this.postingForm = this.createApplicationForm()
    this.selectedCountries.push("Worldwide");
    this.getBusiness()

    this.filteredOptions$ = this.postingForm.get('location')!.valueChanges.pipe(
      startWith(''),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allCountries.slice())),
    )

    this.tagfilteredOptions$ = this.postingForm.get('tags')!.valueChanges.pipe(
      startWith(''),
      map((fruit: string | null) => (fruit ? this._tagfilter(fruit) : this.defaultTags.slice())),
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCountries.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  private _tagfilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.defaultTags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  createApplicationForm(): FormGroup {
    return this.fb.group({
      title: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      job_type: this.fb.control<string>('', [Validators.required]),
      location: [[]],
      tags: [[]],
      logo: this.fb.control<string>(''),
      description: this.fb.control<string>(this.defaultContent, [Validators.required, Validators.minLength(5)]),
    })
  }

  getValidationError(fieldName: string) {
    if (fieldName === 'title') {
      if (this.postingForm.hasError('required', fieldName)) {
        return "Title is required."
      } else if (this.postingForm.hasError('minlength', fieldName)) {
        return "Title must be at least 3 characters long."
      }
    } 
    else if (fieldName === 'job_type') {
      if (this.postingForm.hasError('required', fieldName)) {
        return "Job Type is required."
      }
    } else if (fieldName === 'description') {
      if (this.postingForm.hasError('required', fieldName)) {
        return "Job description is required."
      }
    }
    return "";
  }

  getBusiness() {
    let user = UserService.getUser()

    this.business = {
      id: user['id'],
      company_name: user['company_name'],
      company_email: user['company_email'],
      logo: user['logo'],
      premium: user['premium']
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;

    if (!this.selectedCountries.includes(selectedValue)) {
      this.selectedCountries.push(selectedValue);
    }

    this.countryInput.nativeElement.value = '';
    this.postingForm.get('location')?.setValue(null);
  } 


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim(); 
  
    if (value && !this.selectedCountries.includes(value)) {
      this.selectedCountries.push(value);
    }
  
    event.chipInput!.clear();
    this.postingForm.get('location')?.setValue(null);
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
    this.postingForm.get('tags')?.setValue(null);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedTags.includes(value)) { this.selectedTags.push(value); }

    event.chipInput!.clear();
    this.postingForm.get('tags')?.setValue(null);
  }

  removeTag(fruit: string): void {
    const index = this.selectedTags.indexOf(fruit);
    if (index >= 0) { this.selectedTags.splice(index, 1); }
  }

  post!: JobPost
  process() {
    const uploadedFile = this.resumeUpload.nativeElement.files[0]
    if (uploadedFile === undefined) {
      if (this.selectedCountries.length === 0) {
        this.selectedCountries.push("Worldwide");
      }
      this.post = {
        title: this.postingForm.value['title'],
        job_type: this.postingForm.value['job_type'],
        description: this.postingForm.value['description'],
        candidate_required_location: this.selectedCountries,
        company_name: this.business.company_name,
        tags: this.selectedTags,
        company_logo: this.business.logo
      }
      this.bizJobSvc.newJobPost(this.post).then(res => {
        if (res['isAdded']) {
          this.snackBar.open("Successfully posted!", "Dismiss", {
            duration: 5000
          })
          this.postingForm = this.createApplicationForm()
        } else {
          this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
            duration: 5000
          })
        }
      })
        .catch(err => {
          this.invalidSaveMessage = err.error.message
        })
    }

    if(uploadedFile !== undefined){
      if (this.selectedCountries.length === 0) {
        this.selectedCountries.push("Worldwide");
      }
      this.post = {
        title: this.postingForm.value['title'],
        job_type: this.postingForm.value['job_type'],
        description: this.postingForm.value['description'],
        candidate_required_location: this.selectedCountries,
        company_name: this.business.company_name,
        tags: this.selectedTags
      }

      this.bizJobSvc.newJobPostLogo(this.post, this.resumeUpload).then(res => {
        if (res['isUpdated']) {
          this.snackBar.open("Successfully posted!", "Dismiss", {duration: 5000})
          this.postingForm = this.createApplicationForm()
        } else {
          this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {duration: 5000})
        }
      })
        .catch(err => {
          this.invalidSaveMessage = err.error.message
        })
    }

  }

}
