import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Applicant, AppliedJob, Job } from '../models';
import { Router } from '@angular/router';
import { JobService } from '../service/job.service';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css'
})
export class SavedComponent implements OnInit {

  private jobSvc = inject(JobService)
  private router = inject(Router)

  dataSource!: MatTableDataSource<any>

  allJobs: Job[] = []
  applicant!: Applicant
  invalidMessage: string = ""
  snackBar = inject(MatSnackBar)
  panelOpenState!: boolean
  displayedColumns: string[] = ['company_name', 'title', 'action']
  sub!: Subscription
  isSavedEmpty:Boolean = false
  isAppliedEmpty:Boolean = false

  ngOnInit(): void {
    this.getUser()
    this.loadAppliedJobs()
    this.loadSavedJobs()
  }

  getUser() {
    let user = UserService.getUser()
    this.applicant = { id: user['id'], firstName: user['firstName'], lastName: user['lastName'], email: user['email'] }
  }

  loadSavedJobs() {
    this.jobSvc.getSavedJobs(this.applicant).then(res => {

      if (res.length ===0){
        this.isSavedEmpty = true
      }
      this.dataSource = new MatTableDataSource<any>(res)
    }).catch(err => { console.error(err) })
  }

  AppliedJobs: AppliedJob[] = []
  loadAppliedJobs() {
    this.jobSvc.getAllApplications(this.applicant).then(res => {
      if (res.length ===0){
        this.isAppliedEmpty = true
      }
      this.AppliedJobs = res

    }).catch(err => { console.error(err) })


  }

  formatDate(publication_date: Date): string {
    const date = new Date(publication_date);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  removeBookmark(job: any) {
    this.jobSvc.removeBookmark(this.applicant, job).then((res: any) => {
      if (res && res['isRemoved']) {
        this.snackBar.open("Successfully Removed!", "Dismiss", { duration: 5000 });
        this.loadSavedJobs()
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        });
      }
    })
      .catch(err => {
        this.invalidMessage = err.error.message;
      });
  }


}
