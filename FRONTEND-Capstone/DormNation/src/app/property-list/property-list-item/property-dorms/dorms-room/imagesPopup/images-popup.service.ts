import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImagesPopupService {
  PopupDisplay: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  SharedPopupDisplay: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
}
