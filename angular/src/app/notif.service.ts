import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  constructor() { }

  private dataSubject = new Subject<boolean>();
  data$ = this.dataSubject.asObservable();

  sendData(data: boolean) {
    this.dataSubject.next(data);
  }
}
