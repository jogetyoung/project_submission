import { Injectable } from '@angular/core';
import { EachApplicantSearch, SearchList, Skill } from '../models';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

const INIT_APPS: SearchList = { applicants: [] }

@Injectable({
  providedIn: 'root'
})
export class Searchstore extends ComponentStore<SearchList> {

  constructor() { super(INIT_APPS) }

  readonly saveApps = this.updater<EachApplicantSearch[]>((slice: SearchList, app: EachApplicantSearch[]) => {
    const newSlice: SearchList = { applicants: app };
    return newSlice;
  })

  readonly getMatchingJobs = (search: string): Observable<EachApplicantSearch[]> => {
    const searchWords = search.toLowerCase().split(' ');

    return this.select(state => state.applicants.filter(applicant =>
      applicant.employments?.some(employment =>
        searchWords.some(word =>
          employment.title.toLowerCase().includes(word)
        )
      )
    ));
  };

  readonly getMatchingLocations = (searchLocations: string[]): Observable<EachApplicantSearch[]> =>
    this.select(state => state.applicants.filter(applicant =>
      searchLocations.includes(applicant.location ?? '')
    ));

  readonly getMatchingSkills = (search: Skill[]): Observable<EachApplicantSearch[]> => {
    return this.select(state => state.applicants.filter(applicant =>
      applicant.skills?.some(employment =>
        search.some(term =>
          employment.skill_name.toLowerCase().includes(term.skill_name.toLowerCase())
        )
      )
    ));
  };

  readonly getMatchingJobsandLocation = (search: string, searchLocations: string[]): Observable<EachApplicantSearch[]> => {
    const searchWords = search.toLowerCase().split(' ');

    return this.select(state => state.applicants.filter(applicant =>
      applicant.employments?.some(employment =>
        searchWords.some(word =>
          employment.title.toLowerCase().includes(word))) && searchLocations.includes(applicant.location ?? '')
    ));
  };

  readonly getMatchingJobsandSkills = (search: string, skills: Skill[]): Observable<EachApplicantSearch[]> => {
    const searchWords = search.toLowerCase().split(' ');
  
    return this.select(state => state.applicants.filter(applicant => {
      const jobTitleMatch = applicant.employments?.some(employment =>
        searchWords.some(word =>
          employment.title.toLowerCase().includes(word)
        )
      );
  
      const skillMatch = applicant.skills?.some(skill =>
        skills.some(searchSkill =>
          skill.skill_name.toLowerCase().includes(searchSkill.skill_name.toLowerCase())
        )
      );
  
      return jobTitleMatch && skillMatch;
    }));
  };

  readonly getMatchingLocationsandSkills = (searchLocations: string[], skills: Skill[]): Observable<EachApplicantSearch[]> => {
    return this.select(state => state.applicants.filter(applicant => {
      const matchingLocations = searchLocations.includes(applicant.location ?? '');
  
      const skillMatch = applicant.skills?.some(skill =>
        skills.some(searchSkill =>
          skill.skill_name.toLowerCase().includes(searchSkill.skill_name.toLowerCase())
        )
      );
  
      return matchingLocations && skillMatch;
    }));
  };

  readonly getMatchingAll = (search: string, searchLocations: string[], skills: Skill[]): Observable<EachApplicantSearch[]> => {
    const searchWords = search.toLowerCase().split(' ');
  
    return this.select(state => state.applicants.filter(applicant => {
      const jobTitleMatch = applicant.employments?.some(employment =>
        searchWords.some(word =>
          employment.title.toLowerCase().includes(word)
        )
      );

      const matchingLocations = searchLocations.includes(applicant.location ?? '');
  
      const skillMatch = applicant.skills?.some(skill =>
        skills.some(searchSkill =>
          skill.skill_name.toLowerCase().includes(searchSkill.skill_name.toLowerCase())
        )
      );
  
      return jobTitleMatch && matchingLocations && skillMatch;
    }));
  };

  




}
