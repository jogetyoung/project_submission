import { Injectable } from '@angular/core';
import { Job, JobFilter, JobList } from '../models';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, map } from 'rxjs';

const INIT_JOBS: JobList = { jobs: [] }

@Injectable({
  providedIn: 'root'
})
export class Userstore extends ComponentStore<JobList>{

  constructor() { super(INIT_JOBS) }

  readonly saveJobs = this.updater<Job[]>((slice: JobList, job: Job[]) => {
    const newSlice: JobList = { jobs: job };
    return newSlice;
  })

  readonly getAll = this.select<Job[]>((slice: JobList) => slice.jobs)

  // Define a new selector for selecting a subset of jobs
  readonly selectSubset = (limit: number, offset: number) => this.select<Job[]>(
    (state: JobList) => state.jobs.slice(offset, offset + limit)
  );

  getUniqueJobTypes(): Observable<string[]> {
    return this.select(state => state.jobs.map(job => job.job_type))
      .pipe(
        map(jobTypes => [...new Set(jobTypes)])
      );
  }

  getUniqueLocations(): Observable<string[]> {
    return this.select(state =>
      state.jobs
        .flatMap(job => job.candidate_required_location) // Extract candidate_required_location for each job
        .map(location => location.trim()) // Trim each location string
    ).pipe(
      map(locations => [...new Set(locations)].sort()) // Convert to a unique array of locations and sort alphabetically
    );
  }

  getUniqueTags(): Observable<string[]> {
    return this.select(state =>
      state.jobs
        .flatMap(job => job.tags) // Extract candidate_required_location for each job
        .map(tag => tag.trim()) // Trim each location string
    ).pipe(
      map(skills => [...new Set(skills)].sort()) // Convert to a unique array of locations and sort alphabetically
    );
  }

  getOptList(): Observable<string[]> {
    return this.select(state => state.jobs.map(job => job.title))
      .pipe(
        map(jobTypes => [...new Set(jobTypes)])
      );
  } 

  makeOptList(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();
    return this.select(state => state.jobs.map(job => job.title))
      .pipe(
        map(jobTitles => jobTitles.filter(title => title.toLowerCase().includes(filterValue))),
        map(filteredTitles => [...new Set(filteredTitles)])
      ); 
  }

  readonly reinitJobs = this.updater<Job[]>((slice: JobList, job: Job[]) => {
    const newSlice: JobList = { jobs: [] }; // Empty the slice first
    return { ...newSlice, jobs: job }; // Then update it with the new list of jobs
  })

  readonly getMatchingJobs = (search: string): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    console.log(searchWords)
    return this.select<Job[]>(state => state.jobs.filter(job =>
      searchWords.every(word =>
        job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())
      )
    ));
  };

  readonly getMatchingType = (search: string): Observable<Job[]> =>
    this.select<Job[]>(state => state.jobs.filter(job =>
      job.job_type.toLowerCase().includes(search.toLowerCase())
    ));

  readonly getMatchingLocations = (search: string[]): Observable<Job[]> =>
    this.select<Job[]>(state => state.jobs.filter(job =>
      job.candidate_required_location.some(location =>
        search.some(term => location.toLowerCase() === term.toLowerCase())
      )
    ));

  readonly getSearchAndType = (search: string, type: string): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job =>
      searchWords.every(word =>
        job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())
      ) &&
      job.job_type.toLowerCase().includes(type.toLowerCase())
    ));
  }

  readonly getSearchAndLocation = (search: string, location: string[]): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job =>
    (searchWords.every(word =>
      job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())
    ) &&
      job.candidate_required_location.some(val =>
        location.some(term => val.toLowerCase().includes(term.toLowerCase()))
      )
    )));
  }

  readonly getTypeAndLocation = (type: string, location: string[]): Observable<Job[]> =>
    this.select<Job[]>(state => state.jobs.filter(job =>
      (job.job_type.toLowerCase().includes(type.toLowerCase())) &&
      job.candidate_required_location.some(val =>
        location.some(term => val.toLowerCase().includes(term.toLowerCase())))
    ));

  readonly getAllFilters = (search: string, type: string, location: string[]): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job => (searchWords.every(word =>
      job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())
    )
      && job.job_type.toLowerCase().includes(type.toLowerCase())
      && job.candidate_required_location.some(val =>
        location.some(term => val.toLowerCase().includes(term.toLowerCase())))
    )));
  }

  readonly getMatchingTags = (search: string[]): Observable<Job[]> =>
    this.select<Job[]>(state => state.jobs.filter(job =>
      job.tags.some(location =>
        search.some(term => location.toLowerCase() === term.toLowerCase()))
    ));

  readonly getMatchingTagsAndLocations = (tags: string[], locations: string[]): Observable<Job[]> =>
    this.select<Job[]>(state => state.jobs.filter(job =>
      tags.every(tag => job.tags.some(jobTag =>
        tag.toLowerCase() === jobTag.toLowerCase()
      )) && locations.every(location => job.candidate_required_location.some(jobLocation =>
        location.toLowerCase().includes(jobLocation.toLowerCase())
      ))
    ));

  readonly getMatchingTagsAndSearch = (search: string, tags: string[]): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job => (searchWords.every(word =>
      job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())))
      && tags.every(tag => job.tags.some(jobTag =>
        tag.toLowerCase() === jobTag.toLowerCase()
      ))))
  }

  readonly getMatchingTagsAndType = (type: string, tags: string[]): Observable<Job[]> =>
    this.select<Job[]>(state => state.jobs.filter(job =>
      (job.job_type.toLowerCase().includes(type.toLowerCase())) &&
      job.tags.some(val =>
        tags.some(term => val.toLowerCase() === term.toLowerCase()))
    ));


  readonly getMatchingTagsLocationSearch = (search: string, tags: string[], locations: string[]): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job => (searchWords.every(word =>
      job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())))
      && tags.every(tag => job.tags.some(jobTag =>
        tag.toLowerCase() === jobTag.toLowerCase()
      ))
      && locations.every(location => job.candidate_required_location.some(jobLocation =>
        location.toLowerCase().includes(jobLocation.toLowerCase())
      ))))
  }

  readonly getMatchingTagsLocationType = (type: string, locations: string[], tags: string[]): Observable<Job[]> => 
  this.select<Job[]>(state => state.jobs.filter(job =>
    (job.job_type.toLowerCase().includes(type.toLowerCase())) &&
    job.tags.some(val =>tags.some(term => val.toLowerCase() === term.toLowerCase()))
    && locations.every(location => job.candidate_required_location.some(jobLocation =>
      location.toLowerCase().includes(jobLocation.toLowerCase())
    ))
  ));

  readonly getMatchingTagsSearchType = (search: string, type: string, tags: string[]): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job => (searchWords.every(word =>
      job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())))
      && job.job_type.toLowerCase().includes(type.toLowerCase())
      && tags.every(tag => job.tags.some(jobTag =>
        tag.toLowerCase() === jobTag.toLowerCase()))
        ))
  }

  readonly getAllFour = (search: string, type: string, locations: string[], tags: string[]): Observable<Job[]> => {
    const searchWords = search.toLowerCase().split(' ');
    return this.select<Job[]>(state => state.jobs.filter(job => (searchWords.every(word =>
      job.title.toLowerCase().includes(word) || job.description.toLowerCase().includes(search.toLowerCase())))
      && job.job_type.toLowerCase().includes(type.toLowerCase())
      && locations.every(location => job.candidate_required_location.some(jobLocation =>
        location.toLowerCase().includes(jobLocation.toLowerCase())
      ))
      && tags.every(tag => job.tags.some(jobTag =>
        tag.toLowerCase() === jobTag.toLowerCase()))
        ))
  }

}