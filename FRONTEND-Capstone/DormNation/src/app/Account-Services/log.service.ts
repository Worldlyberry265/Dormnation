// import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })
export class LogService {

  Log: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() { }
}
