import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '../service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Applicant, Business } from '../models';
import { UserService } from '../service/user.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrl: './active-users.component.css'
})
export class ActiveUsersComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  applicants!: Applicant[]
  private profileSvc = inject(ProfileService)
  private authService = inject(AuthenticationService)
  search!: string
  sub!: Subscription
  business!:Business
  

  ngOnInit(): void {
    this.getDBUsers()
  }

  getDBUsers() {
    this.profileSvc.getAll().then(notifications => {
      this.applicants = notifications
    });
  }

  goPremSearch(){
    let user = UserService.getUser()

    this.business = {
      id: user['id'],
      company_name: user['company_name'],
      company_email: user['company_email'],
      premium: user['premium']
    }
    if(this.business.premium){
      this.router.navigate(['/business/prem-search'])
    } else {
      this.router.navigate(['/business/premium'])
    }
  }
  

}
