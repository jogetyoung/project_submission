import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Job } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor() { }
  baseUrl: string = environment.server_url
  private http = inject(HttpClient)

  // Get all job listings
  getJobs(): Promise<Job[]> {
    return firstValueFrom(this.http.get<Job[]>(`${this.baseUrl}/api/getjobs`))
  }

  // Get a single job by ID
  getJobById(id: number): Promise<Job> {
    return firstValueFrom(this.http.get<Job>(`${this.baseUrl}/api/job/${id}`))
  }

  // Get job(s) by company name
  getJobByCompanyName(body: any) {
    const queryparams = new HttpParams().set('name', body);
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/logo`,{ params: queryparams} ))
  }

  // Remove a job listing
  removeJob(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/remove/${id}`))
  }

}
