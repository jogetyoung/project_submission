import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../service/job.service';
import { Applicant, Employment, Skill } from '../models';
import { ProfileService } from '../service/profile.service';
import {  Subscription} from 'rxjs';

@Component({
  selector: 'app-app.profile',
  templateUrl: './app.profile.component.html',
  styleUrl: './app.profile.component.css'
})
export class AppProfileComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  private jobSvc = inject(JobService)
  snackBar = inject(MatSnackBar)
  invalidSaveMessage: string = ""
  profilePic!: string | undefined

  applicant!: Applicant
  private profileSvc = inject(ProfileService)
  userid!: string
  sub!: Subscription
  hasResume: boolean= false
  res!: string | undefined
  empHist:Employment[]=[]
  empSkills:Skill[]=[]
  
  ngOnInit(): void {
    this.userid = this.activatedRoute.snapshot.params['userid'];
    this.getDBUser()
    this.getEmpHist()
    this.getUserSkills()

  }
  
  getDBUser() {
    this.sub = this.profileSvc.getFromDB(this.userid).subscribe(notifications => {
      this.applicant = notifications
      console.log("APPLICANT", this.applicant)

      if (this.applicant.profile_pic === "null") {
        
      } else {
        this.profilePic = this.applicant.profile_pic;
      }

      if (this.applicant.resume === null) {
        this.hasResume = false
      } else {
        this.hasResume = true
        this.res = this.applicant.resume;
      }
    });
  }

  getEmpHist() {
    this.sub = this.profileSvc.getEmpHist(this.userid).subscribe(notifications => {
      this.empHist = notifications
    });
  }

  getUserSkills(){
    this.sub = this.profileSvc.getEmpSkills(this.userid).subscribe(notifications => {
      this.empSkills = notifications
    });
  }

  goback(){
    window.history.back();
  }


}
