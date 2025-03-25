import { Injectable } from '@angular/core';
import { Applicant } from './models';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchApplicantService {
  private applicantsSubject = new BehaviorSubject<Applicant[]>([]);
  applicants$ = this.applicantsSubject.asObservable();

  constructor() { }

  saveApplicants(applicants: Applicant[]): void {
    this.applicantsSubject.next(applicants);
  }

  getAll(): Observable<Applicant[]> {
    return this.applicants$;
  }

  makeOptList(value: string): Observable<Applicant[]> {
    const filterValue = value.toLowerCase();
    return this.applicants$.pipe(
      map(applicants => {
        if (!applicants) return [];
        return applicants.filter(applicant => applicant.headline && applicant.headline.toLowerCase().includes(filterValue));
      })
    );
  }
}
