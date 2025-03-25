import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Applicant } from '../models';
import { ProfileService } from '../service/profile.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-app-search',
  templateUrl: './app-search.component.html',
  styleUrl: './app-search.component.css'
})
export class AppSearchComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  profilePic!: Observable<string | undefined>

  applicants!: Applicant[]
  private profileSvc = inject(ProfileService)
  search!: string
  sub!: Subscription

  ngOnInit(): void {
    this.search = this.activatedRoute.snapshot.params['search'];

    this.getDBUsers()

  }
  
  getDBUsers() {
    this.profileSvc.getFromDBTerms(this.search).then(notifications => {
      this.applicants = notifications
    });
  }

  goToProfile(){
    
  }

  goback(){
    window.history.back();
  }

}
