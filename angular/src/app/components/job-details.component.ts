import { Component, OnInit, inject } from '@angular/core';
import { ListingService } from '../service/listing.service';
import { Applicant, Job } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { JobService } from '../service/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute)
  private listSvc = inject(ListingService)
  private jobSvc = inject(JobService)
  snackBar = inject(MatSnackBar)
  invalidSaveMessage: string = ""
  job!: Job
  applicant!: Applicant

  ngOnInit(): void {
   let jobId = this.activatedRoute.snapshot.params['jobid'];
   this.listSvc.getJobById(jobId).then(result =>{
    this.job = result
   })
  }

  formatDate(publication_date: Date): string {
    const date = new Date(publication_date);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  getUser(){
    let user = UserService.getUser()
    this.applicant = {
    id: user['id'],
     firstName: user['firstName'],
     lastName: user['lastName'],
     email: user['email']
    }
   }

  saveJob(job: Job){
    this.getUser()

    const send ={
      'userid': this.applicant.id,
      'jobid': job.id
    }
    this.jobSvc.bookmarkJob(send).then(res => {
      if (res['isAdded']) {
        this.snackBar.open("Successfully saved!", "Dismiss", {
          duration: 5000
        })
      } else {
        this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
          duration: 5000
        })
      }
    }).catch(err => {
      this.invalidSaveMessage = err.error.message 
    })
  }

  goback(){
    window.history.back();
  }

}
