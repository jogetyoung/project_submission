import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../service/listing.service';
import { Applicant, Business, Job } from '../models';
import { BizJobService } from '../service/biz.job.service';
import { UserService } from '../service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PromoteJobComponent } from './promote-job.component';
import { JobService } from '../service/job.service';
import { ViewService } from '../service/view.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css'
})
export class ApplicantsComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute)
  private listSvc = inject(ListingService)
  private biz = inject(BizJobService)
  private jobSvc = inject(JobService)
  public dialog = inject(MatDialog)
  job!: Job
  jobId!:number
  business!: Business
  allApplicants: Applicant[] = []
  router: Router = inject(Router)
  
  ngOnInit(): void {
    this.jobId = this.activatedRoute.snapshot.params['jobid'];
    this.setJob()
    this.getApplicants()
    this.updatelastseen()

    let user = UserService.getUser()
    this.business = {
      id: user['id'],
      company_name: user['company_name'],
      company_email: user['company_email'],
      premium: user['premium']
    }
  }

  setJob(){
    this.listSvc.getJobById(this.jobId).then(result =>{
      this.job = result
    })
  }

  getTimeDifference(date: Date | undefined): string {
    if (date) {
        return ViewService.getTimeDifference(date);
    } else {
        return ''; // Handle case where date is undefined (or return some default value)
    }
}
  getApplicants(){
    this.biz.getApplicants(this.jobId).then(res =>{
      this.allApplicants = res
    }).catch( err => console.log(err)) 
  }

  formatDate(publication_date: Date): string {
    const date = new Date(publication_date);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  promote(stat: Job) {
    if(this.business.premium){
      const dialogRef = this.dialog.open(PromoteJobComponent, {width: '800px', data: stat});

    } else {
      this.router.navigate(['/business/premium'])
    }
  }

  updatelastseen(): void {
    this.jobSvc.updatelastseen(this.jobId).then( resp =>{ })
  }

  


}