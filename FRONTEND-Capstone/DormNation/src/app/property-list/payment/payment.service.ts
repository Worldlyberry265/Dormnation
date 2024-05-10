import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthClient } from 'src/app/core/auth/auth.client';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  // ReturnedError = new BehaviorSubject<string>('');
  // DuratonOfStay = new BehaviorSubject<number>(0);

  // CheckinDate = new BehaviorSubject<string>('');
  // CheckoutDate = new BehaviorSubject<string>('');
  // Shared = new BehaviorSubject<boolean>(false);
  // RoomID = new BehaviorSubject<number>(0);
  // DormID = new BehaviorSubject<number>(0);

  constructor(private authClient: AuthClient) { }


  addBooking(DormID: number, RoomID: number, GuestID :  number, Checkin: string, Checkout: string, Shared: boolean, Price : number) : Observable<string> {
   
    const BookingInfo = {
      dorm_id : DormID,
      room_id : RoomID,
      guest_id : GuestID,
      checkin : Checkin,
      checkout : Checkout,
      shared : Shared,
      price : Price
    }
    return this.authClient.addBooking(BookingInfo);
  }
}

