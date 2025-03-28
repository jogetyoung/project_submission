import { HttpClient, HttpParams } from '@angular/common/http';
import { ElementRef, Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';
import { Applicant, AppliedJob, Job } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor() { }
  baseUrl: string = environment.server_url
  private http = inject(HttpClient)

  // Submit job application with resume
  saveJobApplication(app: Applicant, job: Job, image: ElementRef) {
    const formData = new FormData()
    formData.set('jobid', job.id)
    formData.set('resume', image.nativeElement.files[0])

    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/repo/${app.id}/application`, formData))
  }

  // Get all applications for a user
  getAllApplications(app: any): Promise<AppliedJob[]> {
    return firstValueFrom(this.http.get<AppliedJob[]>(`${this.baseUrl}/api/repo/applications/${app.id}`))
  }

  // Save (bookmark) a job
  bookmarkJob(send: any) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/repo/save`, send))
  }

  // Get all saved jobs for a user
  getSavedJobs(app: any): Promise<Job[]> {
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/repo/saved/${app.id}`))
  }

  // Remove a job bookmark
  removeBookmark(app: Applicant, job: any) {
    return firstValueFrom(this.http.delete<any>(`${this.baseUrl}/api/repo/remove/${app.id}/${job}`));
  }

  // Update last seen timestamp for a job (for notifications)
  updatelastseen(jobid: any) {
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/repo/updatelastseen/${jobid}`));
  }
}
