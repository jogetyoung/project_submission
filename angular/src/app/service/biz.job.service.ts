import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Business, EachApplicantSearch, Job, JobPost, JobStat } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BizJobService {

  constructor() { }
  baseUrl: string = environment.server_url
  private http = inject(HttpClient)

  newJobPost(send: any) { 
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/business/new`, send)) 
  }

  getPostings(bizname: string):Promise<JobStat[]> {
    return firstValueFrom( 
      this.http.get<JobStat[]>(`${this.baseUrl}/api/business/postings/${bizname}`)
    )
  }

  fetchUnreadNotifications(biz: Business):Observable<any>{ 
    return this.http.get<any>(`${this.baseUrl}/api/business/unread/${biz.company_name}`);
  } 

  updateLastCheck(biz: Business):Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/business/update-time/${biz.company_name}`); 
  }

  getApplicants(jobid: number):Promise<any> { 
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/api/business/applicants/${jobid}`)
    )
  }

  updateJob(app: Job){
    return firstValueFrom(
      this.http.put<any>(`${this.baseUrl}/api/business/update/${app.id}`, app)
    ) 
  }

  updatePromoted(job: JobStat){
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/api/business/promote/${job.id}`)
    ) 
  }

  getAllForSearch():Promise<EachApplicantSearch[]>{
    return firstValueFrom(
      this.http.get<EachApplicantSearch[]>(`${this.baseUrl}/api/business/allapplicants`)
    ) 
  }

  removePost(id:any):Promise<any>{
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/business/remove-job/${id}`));
  }

  newJobPostLogo(send: JobPost, image: ElementRef) { 
    const formData = new FormData()
    if (send.candidate_required_location && send.candidate_required_location.length > 0) {
      const locationfullstring = send.candidate_required_location.join(',');
    
      formData.set('candidate_required_location',  locationfullstring)
    }
    if (send.tags && send.tags.length > 0) {
      const tagsfullstring = send.tags.join(',');

      formData.set('tags', tagsfullstring)
    }
    formData.set('job_type', send.job_type)
    formData.set('title', send.title)
    formData.set('description', send.description)
    formData.set('company_name', send.company_name)
    formData.set('company_logo', image.nativeElement.files[0]) 

    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/business/jobwithlogo`, formData))
  }

  
}
