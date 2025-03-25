import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BizJobService } from '../service/biz.job.service';
import { UserService } from '../service/user.service';
import { Business, Job, JobStat } from '../models';
import { MatTableDataSource } from '@angular/material/table';
import { ViewService } from '../service/view.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditListingComponent } from './edit-listing.component';
import { ListingService } from '../service/listing.service';
import { PromoteJobComponent } from './promote-job.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifService } from '../notif.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit, OnDestroy {
  
  private bizJobSvc = inject(BizJobService)
  dataSource!: MatTableDataSource<any>
  displayedColumns: string[] = ['title', 'action', 'reach', 'promote']
  sub!: Subscription
  private listSvc = inject(ListingService)
  job!: Job
  isPromoteButtonClicked: boolean = false;
  jobList: JobStat[] = []
  business!: Business
  public dialog = inject(MatDialog)
  router: Router = inject(Router)
  snackBar = inject(MatSnackBar)
  markJobs: number[] = [] 
  navbarTrigger: boolean = false
  
  private notifSvc = inject(NotifService)
  
  ngOnInit(): void {
    this.getBusiness()
    this.loadJobPosts()
    this.updateLastCheck()
  }
  
  send(send: boolean) {
    this.notifSvc.sendData(send);
  }
  
  getBusiness() {
    let user = UserService.getUser()
    this.business = {
      id: user['id'],
      company_name: user['company_name'],
      company_email: user['company_email'],
      premium: user['premium']
    } 
  }
  
  loadJobPosts() {
    this.bizJobSvc.getPostings(this.business.company_name).then(res => {
      this.jobList = res
      this.dataSource = new MatTableDataSource<any>(this.jobList)
      this.jobsWithNotif(this.jobList)
      
    }).catch(err => { console.error(err) })
  }
  
  jobsWithNotif(jobList: JobStat[]){
    for (const job of this.jobList) {
      if(job.last_updated !== null && job.last_seen !== null){ 
        if (job.last_updated> job.last_seen) {
          job.notif = true;
          this.navbarTrigger = true
        }
        this.send(this.navbarTrigger)
      }
      if(job.last_updated !== null && job.last_seen === null){ 
        job.notif = true;
        this.navbarTrigger = true
      }
      this.send(this.navbarTrigger)
    }

  } 
  
  getTimeDifference(date: Date): string {
    return ViewService.getTimeDifference(date)
  }
  
  updateLastCheck(): void {
    this.sub = this.bizJobSvc.updateLastCheck(this.business).subscribe(notifications => {
    });
  }
  
  editPost(stat: JobStat) {
    this.listSvc.getJobById(stat.id).then(result => {
      this.job = result
      
      const dialogRef = this.dialog.open(EditListingComponent, {width: '800px', data: this.job});
      
      dialogRef.afterClosed().subscribe(() => {  });
    })
  }
  
  promote(stat: JobStat) {
    if(this.business.premium){
      const dialogRef = this.dialog.open(PromoteJobComponent, {width: '800px', data: stat});
      
      dialogRef.afterClosed().subscribe(() => { this.loadJobPosts() });
      
    } else {
      this.router.navigate(['/business/premium'])
    }
  }
  
  deletePost(stat: JobStat){
    if(confirm('Are you sure you want to delete job post for ' + stat.title)){
      this.listSvc.removeJob(stat.id).then(res => {
        if (res['isRemoved']) {
          this.snackBar.open("Successfully removed!", "Dismiss", {
            duration: 20000
          })
          this.loadJobPosts()
          
        } else {
          this.snackBar.open("Something went wrong. Please try again in a few seconds.", "Dismiss", {
            duration: 20000
          })
        }
      })
    }
    
  }
  
  ngOnDestroy(): void {
    this.loadJobPosts()
    this.send(this.navbarTrigger)
    this.sub.unsubscribe()
  }
  
}
