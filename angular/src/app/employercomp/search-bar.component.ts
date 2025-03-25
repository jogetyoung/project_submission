import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, startWith, switchMap } from 'rxjs';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { ProfileService } from '../service/profile.service';
import { SearchApplicantService } from '../search-applicant-store';
import { Applicant } from '../models';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit{

  users!: Observable<string[]>;

  private fb = inject(FormBuilder)
  private router = inject(Router)
  private userSubscription!: Subscription; 

  form!: FormGroup

  filteredOptions$!: Observable<Applicant[]>;
  private filterStore = inject(SearchApplicantService)

  private userSvc = inject(ProfileService)

  ngOnInit(): void {
    this.form = this.createForm()
    this.getAllUsers()
  }

  createForm(): FormGroup {
    return this.fb.group({
      search: this.fb.control<string>('')
    })
  }

  getAllUsers(){
    this.userSvc.getAll().then(res => {
      this.filterStore.saveApplicants(res)

      this.filteredOptions$ = this.form.get('search')!.valueChanges.pipe(
        startWith(''),
        switchMap(value => this.filterStore.makeOptList(value)))
    })
  }

  searchUsers() {
    let search: string = this.form.value['search']
    this.router.navigate([`/business/profile-search/${search}`])
  }

  goProfile(applicant: Applicant){
    this.router.navigate([`/business/app-profile/${applicant.id}`])
  }


}
