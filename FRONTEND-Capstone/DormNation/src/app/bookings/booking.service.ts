import { Injectable } from '@angular/core';
import { AuthClient } from '../core/auth/auth.client';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private authClient : AuthClient) { }

  getBooking(id : number) {
    return this.authClient.getBooking(id);
  }
}
