import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Applicant, Employment, Skill } from '../models';
import { UserService } from '../service/user.service';
import { EditProfileComponent } from './edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { PicEditComponent } from './pic-edit.component';
import { ResEditComponent } from './res-edit.component';
import { Observable, Subscription, of } from 'rxjs';
import { ProfileService } from '../service/profile.service';
import { AddHistoryComponent } from './add-history.component';
import { EditHistComponent } from './edit-hist.component';
import { SkillsSectionComponent } from './skills-section.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

  snackBar = inject(MatSnackBar)
  invalidSaveMessage: string = ""
  public dialog = inject(MatDialog)
  profilePic: string | undefined
  applicant!: Applicant
  private profileSvc = inject(ProfileService)
  dispMsg!: string
  hasResume: boolean = false
  resLink!: string | undefined
  empHist:Employment[]=[]
  empSkills:Skill[]=[]
  user!:any
  sub!: Subscription

  ngOnInit(): void {
    this.getUser()
    this.getDBUser()
    this.getEmpHist()
    this.getUserSkills()
  }

  getUser() {
    this.user = UserService.getUser()
    this.applicant = {
      id: this.user['id'], firstName: this.user['firstName'], lastName: this.user['lastName'],
      email: this.user['email'],headline: this.user['headline'], location: this.user['location'],
      resume: this.user['resume'], profile_pic: this.user['profile_pic'],
    }
  }

  getDBUser() {
    this.sub = this.profileSvc.getFromDB(this.user['id']).subscribe(notifications => {
      this.applicant = notifications
      this.profilePic = this.applicant.profile_pic;

      if (this.applicant.resume === null) {
        this.dispMsg = 'Upload a resume, visible to Nomad Nest Business users'
      } else {
        this.dispMsg = ' '
        this.hasResume = true
        this.resLink = this.applicant.resume
      }
    });
  }

  getEmpHist() {
    this.sub = this.profileSvc.getEmpHist(this.user['id']).subscribe(notifications => {
      this.empHist = notifications
    });
  }

  getUserSkills(){
    this.sub = this.profileSvc.getEmpSkills(this.user['id']).subscribe(notifications => {
      this.empSkills = notifications
    });
  }

  editProfile(applicant: any) {
    const dialogRef = this.dialog.open(EditProfileComponent, {width: '900px', data: applicant });

    dialogRef.afterClosed().subscribe(() => {
      this.getDBUser();
    });
  }

  editPic(applicant: any) {
    const dialogRef = this.dialog.open(PicEditComponent, {width: '600px', data: applicant});

    dialogRef.afterClosed().subscribe(() => {
      this.getDBUser();
    });
  }

  editRes(applicant: any) {
    const dialogRef = this.dialog.open(ResEditComponent, {width: '900px',data: applicant });

    dialogRef.afterClosed().subscribe(() => {
      this.getDBUser();
    });
  }

  addExperience(applicant: any) {
    const dialogRef = this.dialog.open(AddHistoryComponent, {width: '900px',data: applicant });

    dialogRef.afterClosed().subscribe(() => {
      this.getEmpHist();
    });

  }

  editExperience(employment: Employment) {
    const dialogRef = this.dialog.open(EditHistComponent, {width: '900px',data: employment});

      dialogRef.afterClosed().subscribe(() => {
      this.getEmpHist();
    });

  }

  addSkills() {
    const dialogRef = this.dialog.open(SkillsSectionComponent, {width: '900px',data: this.empSkills });

    dialogRef.afterClosed().subscribe(() => {
      this.getUserSkills();
    });

  }


}
