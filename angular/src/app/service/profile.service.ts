import { HttpClient, HttpParams } from '@angular/common/http';
import { ElementRef, Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Applicant, Employment, Skill } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }
  baseUrl: string = environment.server_url
  private http = inject(HttpClient)

  updateAppProfilePic(app: Applicant, image: ElementRef) {
    const formData = new FormData()
    formData.set('profile_pic', image.nativeElement.files[0])

    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/user/profile-pic/${app.id}`, formData))
  }

  updateAppProfileRes(app: Applicant,resume: ElementRef) {
    const formData = new FormData()
    formData.set('resume', resume.nativeElement.files[0]) 

    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/user/resume/${app.id}`, formData))
  }

  updateAppProfile(app: Applicant) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/user/applicant/update/${app.id}`, app)) 
  }

  getFromDB(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/user/applicant/${id}`);
  }

  getAll(): Promise<Applicant[]> {
    return firstValueFrom(this.http.get<Applicant[]>(`${this.baseUrl}/user/getall`))
  }

  getFromDBTerms(search: string): Promise<Applicant[]> {
    const queryparams = new HttpParams().set('search', search); 
    return firstValueFrom(this.http.get<Applicant[]>(`${this.baseUrl}/user/search` , { params: queryparams}))
  }

  updateEmployment(app: Applicant, values: Employment) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/user/employment/update/${app.id}`, values)) 
  }

  getEmpHist(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/user/employment-history/${id}`);
  }

  updateHist(app: Employment) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/user/updatehist/${app.id}`, app)) 
  }

  removeHist(id:any):Promise<any>{
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/user/remove-history/${id}`));
  }

  getSkillList():Promise<any>{
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/api/repo/all-skills`));
  }

  updateSkills(app: any, skills: Skill[]) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/user/updateskills/${app}`, skills)) 
  }

  getEmpSkills(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/user/allskills/${id}`);
  }




}
