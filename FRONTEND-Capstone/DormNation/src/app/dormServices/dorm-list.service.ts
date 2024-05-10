import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dorm } from '../models/Dorm.model';
import { LoginError } from '../models/Error.model';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { AuthClient } from '../core/auth/auth.client';

@Injectable({
  providedIn: 'root'
})
export class DormListService {

  DormsSearchResult = new BehaviorSubject<Dorm[]>([]);
  ReturnedError = new BehaviorSubject<string>('');
  DuratonOfStay = new BehaviorSubject<number>(0);
  CheckinDate = new BehaviorSubject<string>('');
  CheckoutDate = new BehaviorSubject<string>('');


  constructor(private authService: AuthService,
    private router: Router,
    private authclient: AuthClient) {
  }



  onSearchForm(Location: string, StartDate, EndDate, NumberOfGuests: number, PriceDist?: string, Rating?: number, Gender?: string, SharedKitchen?: boolean, Parking?: boolean, minPrice ?: number, maxPrice ?: number) {
    const startDate = this.formatDate(StartDate);
    const endDate = this.formatDate(EndDate);

    const durationInMonths = this.calculateDurationInMonths(StartDate, EndDate);
    console.log(durationInMonths);
    
    this.MainSearch(Location, startDate, endDate, NumberOfGuests, PriceDist, Rating, Gender, SharedKitchen, Parking, minPrice, maxPrice).subscribe(
      (Dorms: Dorm[]) => {
        
        console.log("Dorms length: " + Dorms.length);
        this.DormsSearchResult.next(Dorms);
        localStorage.setItem('dorms', JSON.stringify(Dorms));
        this.DuratonOfStay.next(durationInMonths);
        localStorage.setItem('duration', JSON.stringify(durationInMonths));
        this.CheckinDate.next(startDate);
        localStorage.setItem('CheckinDate', startDate);
        this.CheckoutDate.next(endDate);
        localStorage.setItem('CheckoutDate', endDate);

        localStorage.setItem('NumberOfGuests', JSON.stringify(NumberOfGuests));


        this.ReturnedError.next('');
        this.router.navigate(['/propertyList']);

      }, (ResponseError: any) => {
        this.DormsSearchResult.next([]);
        localStorage.removeItem('dorms');
        this.ReturnedError.next(ResponseError.error.message);
        this.router.navigate(['/propertyList']);
      });
  }
  
  private formatDate(date: Date): string {
    const options: any = { month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  private calculateDurationInMonths(startDate: Date, endDate: Date): number {
    // Calculate the difference in milliseconds

    //To fix the endDate and make it to be at the last day of the month
    endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

    const timeDifference = endDate.getTime() - startDate.getTime();


    // Convert the difference to months
    const durationInMonths = timeDifference / (1000 * 60 * 60 * 24 * 30.44); // An average month duration
    console.log("durationInMonths before rounding: " + durationInMonths);
    // Round the result to get the whole months
    return Math.round(durationInMonths);
  }


  MainSearch(Location: String, startDate: String, endDate: String, NumberOfGuests: number, PriceDist?: string, Rating?: number, Gender?: string, SharedKitchen?: boolean, Parking?: boolean, minPrice ?: number, maxPrice ?: number): Observable<Object[]> {
    
    if(minPrice === undefined){
      minPrice = 0;
    }
    if( isNaN(maxPrice) ||maxPrice === undefined){
      maxPrice = 0;
    }
    console.log(minPrice);
    console.log("now max: " + maxPrice);

    return this.authclient.MainSearch(Location, startDate, endDate, NumberOfGuests, PriceDist, Rating, Gender, SharedKitchen, Parking, minPrice, maxPrice);
  }

  DormsTitleSearch(SearchedTitle : string): Observable<string[]> {  

    if(SearchedTitle.length === 0 ){
      SearchedTitle = null;
    }

    return this.authclient.DormTilteSearch(SearchedTitle);
}


}
