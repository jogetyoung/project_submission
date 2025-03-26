import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Observable, Subscription, map, startWith, switchMap } from 'rxjs';
import { Job } from '../models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ViewService } from '../service/view.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ListingService } from '../service/listing.service';
import { Userstore } from '../stores/userstore';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-jobs-listing',
  templateUrl: './jobs-listing.component.html',
  styleUrl: './jobs-listing.component.css'
})
export class JobsListingComponent implements OnInit {

  private listSvc = inject(ListingService)
  private filterStore = inject(Userstore)
  private fb = inject(FormBuilder); form!: FormGroup
  private jobSubscription!: Subscription;

  //data source for jobs table
  dataSource!: MatTableDataSource<any>

  allJobs: Job[] = []
  jobs$: Job[] = []

  //using observable for my drop down options
  jobtypes!: Observable<string[]>;
  filteredOptions$!: Observable<string[]>;
  countryfilteredOptions$!: Observable<string[]>;
  tagfilteredOptions$!: Observable<string[]>;


  locations!: string[]
  tags!: string[]

  displayedColumns: string[] = ['title', 'company_name', 'job_type', 'location', 'period']

  //handling pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalJobs!: number
  pageSize = 20;

  //location input field reference
  @ViewChild('countryInput') countryInput!: ElementRef
  selectedCountries: string[] = []

  //tags input reference
  @ViewChild('tagInput') tagInput!: ElementRef
  selectedTags: string[] = []

  //key codes for chip separator
  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodesTags: number[] = [ENTER, COMMA];

  //flag for empty search results
  isSearchEmpty: boolean = false

  ngOnInit(): void {
    this.getAllJobs()
    this.form = this.createForm()
    this.reset()
    this.dataSource = new MatTableDataSource(this.jobs$);
    this.selectedCountries.push("Worldwide", "USA");
  }

  //fetch all jobs from service and set up observables for filtering
  private getAllJobs() {
    this.listSvc.getJobs().then(result => {
      this.allJobs = result

      this.totalJobs = this.allJobs.length;
      this.filterStore.saveJobs(this.allJobs)

      this.jobSubscription = this.filterStore.selectSubset(20, 0).subscribe(res => { this.jobs$ = res })
      this.jobtypes = this.filterStore.getUniqueJobTypes()
      this.jobSubscription = this.filterStore.getUniqueLocations().subscribe(loc => this.locations = loc)
      this.jobSubscription = this.filterStore.getUniqueTags().subscribe(tags => this.tags = tags)

      this.filteredOptions$ = this.form.get('search')!.valueChanges.pipe(startWith(''),
        switchMap(value => this.filterStore.makeOptList(value)))

      this.countryfilteredOptions$ = this.form.get('location')!.valueChanges.pipe(startWith(''),
        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.locations.slice())))

      this.tagfilteredOptions$ = this.form.get('tag')!.valueChanges.pipe(startWith(''),
        map((fruit: string | null) => (fruit ? this._filtertags(fruit) : this.tags.slice())))
    })
  }

  //filter function for location
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  //filter tag function
  private _filtertags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  private createForm(): FormGroup {
    return this.fb.group({
      search: this.fb.control<string>(''), type: this.fb.control<string>(''), location: this.fb.control<string>(''), tag: this.fb.control<string>('')
    })
  }

  getTimeDifference(date: Date): string {
    return ViewService.getTimeDifference(date)
  }

  //capitalize the first letter of Jobs
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  //handle pagination
  onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const offset = pageIndex * pageSize;
    this.jobSubscription = this.filterStore.selectSubset(pageSize, offset).subscribe(jobs => {
      this.jobs$ = jobs;
    });
  }

  //selection of location from dropdown
  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;

    if (!this.selectedCountries.includes(selectedValue)) {
      this.selectedCountries.push(selectedValue);
    }

    this.countryInput.nativeElement.value = '';
    this.form.get('location')?.setValue(null);
  }

  //handle adding location
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedCountries.includes(value)) {
      this.selectedCountries.push(value);
    }

    event.chipInput!.clear();
    this.form.get('location')?.setValue(null);
  }

  //handles removing location chip
  remove(fruit: string): void {
    const index = this.selectedCountries.indexOf(fruit);
    if (index >= 0) { this.selectedCountries.splice(index, 1); }
  }

  //handle selection of tag from dropdown
  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;

    if (!this.selectedTags.includes(selectedValue)) {
      this.selectedTags.push(selectedValue);
    }

    this.tagInput.nativeElement.value = '';
    this.form.get('tag')?.setValue(null);
  }

  //handle adding tag
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedTags.includes(value)) {
      this.selectedTags.push(value);
    }

    event.chipInput!.clear();
    this.form.get('tag')?.setValue(null);
  }

  removeTag(fruit: string): void {
    const index = this.selectedTags.indexOf(fruit);
    if (index >= 0) { this.selectedTags.splice(index, 1); }
  }

  //resets filters and displays job results
  reset() {
    this.isSearchEmpty = false
    this.filterStore.reinitJobs(this.allJobs)
    this.jobSubscription = this.filterStore.selectSubset(20, 0).subscribe(res => { this.jobs$ = res })
    this.totalJobs = this.allJobs.length;
    this.form.reset()
    this.selectedCountries = []
    this.selectedTags = []
  }

  //process the job search with selected filters
  searchJobRole() {
    this.isSearchEmpty = false
    this.filterStore.reinitJobs(this.allJobs)
    let search: string = this.form.value['search']
    let type: string = this.form.value['type']
    let filterLocations: string[] = this.selectedCountries
    let filtertags: string[] = this.selectedTags

    //handle mix and math of filters
    if (search === null && type === null && filterLocations.length > 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getMatchingLocations(filterLocations)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = jobs.length
        });
    }

    if (type === null && search !== null && filterLocations.length === 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getMatchingJobs(search)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (search === null && type !== null && filterLocations.length === 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getMatchingType(type)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (search !== null && type !== null && filterLocations.length === 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getSearchAndType(search, type)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (search !== null && type === null && filterLocations.length > 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getSearchAndLocation(search, filterLocations)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (search === null && type !== null && filterLocations.length > 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getTypeAndLocation(type, filterLocations)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (search !== null && type !== null && filterLocations.length > 0 && filtertags.length === 0) {
      this.jobSubscription = this.filterStore.getAllFilters(search, type, filterLocations)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (search === null && type === null && filterLocations.length === 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTags(filtertags)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = jobs.length
        });
    }

    if (type === null && search === null && filterLocations.length > 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTagsAndLocations(filtertags, filterLocations)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (type === null && search !== null && filterLocations.length === 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTagsAndSearch(search, filtertags)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (type !== null && search === null && filterLocations.length === 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTagsAndType(type, filtertags)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }


    if (type === null && search !== null && filterLocations.length > 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTagsLocationSearch(search, filtertags, filterLocations)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (type !== null && search === null && filterLocations.length > 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTagsLocationType(type, filterLocations, filtertags)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (type !== null && search !== null && filterLocations.length === 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getMatchingTagsSearchType(search, type, filtertags)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    if (type !== null && search !== null && filterLocations.length > 0 && filtertags.length > 0) {
      this.jobSubscription = this.filterStore.getAllFour(search, type, filterLocations, filtertags)
        .subscribe(jobs => {
          this.jobs$ = jobs;
          this.totalJobs = this.jobs$.length;
        });
    }

    //show message if no search results appear
    if (this.jobs$.length === 0) {
      this.isSearchEmpty = true
    }

    //update job display and reset to the first page
    this.filterStore.reinitJobs(this.jobs$)
    this.jobSubscription = this.filterStore.selectSubset(20, 0).subscribe(res => { this.jobs$ = res })
    this.paginator.firstPage();
  }

}
