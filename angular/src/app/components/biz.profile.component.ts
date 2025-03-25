import { Component, OnInit, inject } from '@angular/core';
import { BizJobService } from '../service/biz.job.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Job, JobStat } from '../models';
import { ViewService } from '../service/view.service';

@Component({
  selector: 'app-biz.profile',
  templateUrl: './biz.profile.component.html',
  styleUrl: './biz.profile.component.css'
})
export class BizProfileComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  
  private bizJobSvc = inject(BizJobService)
  dataSource!: MatTableDataSource<any>
  displayedColumns: string[] = ['title', 'action']
  jobList: JobStat[] =[]
  companyname!:string
  
  ngOnInit(): void {
    this.companyname = this.activatedRoute.snapshot.params['companyname'];
    this.loadJobPosts()
  }
  
  loadJobPosts() {
    this.bizJobSvc.getPostings(this.companyname).then(res => {
      this.jobList =res 
      this.dataSource = new MatTableDataSource<any>(res)
    }).catch(err => { console.error(err) })
  }

  getTimeDifference(date: Date): string {
    return ViewService.getTimeDifference(date)
  }

  goback(){
    window.history.back();
  }

}
