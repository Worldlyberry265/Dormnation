import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DormService } from './dorm.service';

@Injectable({
  providedIn: 'root'
})
export class DormResolverService implements Resolve<Object> {

  constructor(private dormService : DormService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Object | Observable<Object> | Promise<Object> {
    const CheckinDate = localStorage.getItem('CheckinDate');
    const CheckoutDate = localStorage.getItem('CheckoutDate');
    const NumberOfGuests = +localStorage.getItem('NumberOfGuests');
      return this.dormService.getDorm(+route.params['id'], CheckinDate, CheckoutDate, NumberOfGuests);
  }
}
