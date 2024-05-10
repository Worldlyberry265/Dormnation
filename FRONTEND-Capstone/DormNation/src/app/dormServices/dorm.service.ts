import { Injectable } from '@angular/core';
import { AuthClient } from '../core/auth/auth.client';

@Injectable({
  providedIn: 'root'
})
export class DormService {

  constructor(private authClient: AuthClient) { }

  getDorm(id: number, StartDate ?: string, EndDate?: string, NumberOfGuests?: number) {
    console.log("sTARTDATE FROM RESOLVER: " + StartDate);
    
    // if (NumberOfGuests === null || NumberOfGuests === undefined) {
    //   NumberOfGuests = 0;
    // }

    return this.authClient.getDorm(id, StartDate, EndDate, NumberOfGuests);
  }

}
