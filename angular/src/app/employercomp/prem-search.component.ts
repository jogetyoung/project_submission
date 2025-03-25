import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EachApplicantSearch, Skill } from '../models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ViewService } from '../service/view.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProfileService } from '../service/profile.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { BizJobService } from '../service/biz.job.service';
import { Searchstore } from '../stores/searchstore';

@Component({
  selector: 'app-prem-search',
  templateUrl: './prem-search.component.html',
  styleUrl: './prem-search.component.css'
})
export class PremSearchComponent implements OnInit {

  private fb: FormBuilder = inject(FormBuilder)
  searchForm!: FormGroup
  allCountries: string[] = ViewService.allcountries
  skillsList!: Skill[]

  filteredOptions$!: Observable<string[]>;
  tagfilteredOptions$!: Observable<Skill[]>;
  private profileSvc = inject(ProfileService)
  private bizJobSvc = inject(BizJobService)
  applicants!: EachApplicantSearch[]
  displayResult!: EachApplicantSearch[]
  private filterStore = inject(Searchstore)

  @ViewChild('countryInput')
  countryInput!: ElementRef
  selectedCountries: string[] = []

  @ViewChild('skillInput')
  tagInput!: ElementRef
  selectedSkills: Skill[] = []

  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodesTags: number[] = [ENTER, COMMA];
  isSearchEmpty: boolean = false

  ngOnInit(): void {
    this.searchForm = this.createApplicationForm()
    this.getListFromBack()
    this.getToStore()

    this.filteredOptions$ = this.searchForm.get('location')!.valueChanges.pipe(
      startWith(''),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allCountries.slice())),
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCountries.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  getListFromBack() {
    this.profileSvc.getSkillList().then(res => {
      this.skillsList = res

      this.tagfilteredOptions$ = this.searchForm.get('skills')!.valueChanges.pipe(startWith(''),
        map((fruit: string | null) => (fruit ? this._tagfilter(fruit) : this.skillsList.slice())))
    })
  }

  private _tagfilter(value: string): Skill[] {
    return this.skillsList.filter(skill => skill.skill_name.toLowerCase().includes(value));
  }

  getToStore() {
    this.bizJobSvc.getAllForSearch().then(res => {
      this.applicants = res

      this.filterStore.saveApps(this.applicants)
    })
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill: Skill = event.option.value;

    if (!this.selectedSkills.includes(selectedSkill)) {
      this.selectedSkills.push(selectedSkill);}

    this.countryInput.nativeElement.value = '';
    this.searchForm.get('skills')?.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const selectedSkill = this.skillsList.find(skill => skill.skill_name === value);
      if (selectedSkill && !this.selectedSkills.includes(selectedSkill)) {
        this.selectedSkills.push(selectedSkill);
      }
    }

    event.chipInput!.clear();
    this.searchForm.get('skills')?.setValue(null);
  }

  remove(fruit: Skill): void {
    const index = this.selectedSkills.indexOf(fruit);
    if (index >= 0) { this.selectedSkills.splice(index, 1); }
  }

  locselected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;

    if (!this.selectedCountries.includes(selectedValue)) {
      this.selectedCountries.push(selectedValue);
    }

    this.countryInput.nativeElement.value = '';
    this.searchForm.get('location')?.setValue(null);
  }

  locadd(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
  
    if (value && !this.selectedCountries.includes(value)) {
      this.selectedCountries.push(value);
    }
  
    event.chipInput!.clear();
    this.searchForm.get('location')?.setValue(null);
  }

  locremove(fruit: string): void {
    const index = this.selectedCountries.indexOf(fruit);
    if (index >= 0) { this.selectedCountries.splice(index, 1); }
  }


  createApplicationForm(): FormGroup {
    return this.fb.group({
      title: [], location: [[]], skills: [[]],
    })
  }

  reset() {
    this.filterStore.saveApps(this.applicants)
    this.isSearchEmpty = false
    this.searchForm.reset()
    this.selectedCountries = []
    this.selectedSkills= []
  }

  sub!: Subscription

  process() {
    this.isSearchEmpty = false
    this.filterStore.saveApps(this.applicants)
    let search: string = this.searchForm.value['title']
    let filterLocations: string[] = this.selectedCountries
    let filterSkills: Skill[] = this.selectedSkills

    if (search !== null && filterLocations.length === 0 && filterSkills.length === 0) {
      // console.log('only search populated')
      this.sub = this.filterStore.getMatchingJobs(search)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (search === null && filterLocations.length !== 0 && filterSkills.length === 0) {
      this.sub = this.filterStore.getMatchingLocations(filterLocations)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (search === null && filterLocations.length === 0 && filterSkills.length !== 0) {
      this.sub = this.filterStore.getMatchingSkills(filterSkills)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (search !== null && filterLocations.length !== 0 && filterSkills.length === 0) {
      this.sub = this.filterStore.getMatchingJobsandLocation(search, filterLocations)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (search !== null && filterLocations.length === 0 && filterSkills.length !== 0) {
      // console.log('only search and skills populated')
      this.sub = this.filterStore.getMatchingJobsandSkills(search, filterSkills)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (search === null && filterLocations.length !== 0 && filterSkills.length !== 0) {
      // console.log('only locations and skills populated')
      this.sub = this.filterStore.getMatchingLocationsandSkills(filterLocations, filterSkills)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (search !== null && filterLocations.length !== 0 && filterSkills.length !== 0) {
      // console.log('only locations and skills populated')
      this.sub = this.filterStore.getMatchingAll(search, filterLocations, filterSkills)
        .subscribe(jobs => {
          this.displayResult = jobs;
        });
    }

    if (this.displayResult.length === 0) {
      this.isSearchEmpty = true
    }

  }
}
