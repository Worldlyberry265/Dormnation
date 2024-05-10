import { Component, OnInit } from '@angular/core';
import { PaymentService } from './payment.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  CheckinDate: string;
  CheckoutDate: string;
  Shared: boolean;
  Price : number;
  RoomID: number;
  DormID: number;
  GuestID: number;
  GuestGender: string;

  ReturnedError: string;


  constructor(private jwthelper: JwtHelperService, private payServ: PaymentService, private router: Router) { }


  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = this.jwthelper.decodeToken(token);
      this.GuestID = decodedToken.ID;
      this.GuestGender = decodedToken.Gender;
    }
    const dormGender = localStorage.getItem("dormGender");
    console.log(dormGender);
    console.log(this.GuestGender);
    if( !(dormGender === this.GuestGender || dormGender === 'Both' || dormGender === 'Mixed')){
      this.ReturnedError = "The dorm you chose only allows " + dormGender;
    }

    this.RoomID = +localStorage.getItem('RoomID');
    this.DormID = +localStorage.getItem('DormID');
    this.Price = +localStorage.getItem('Price');
    this.CheckinDate = localStorage.getItem('CheckinDate');
    this.CheckoutDate = localStorage.getItem('CheckoutDate');

    const sharedFromStorage = localStorage.getItem('Shared');
    this.Shared = JSON.parse(sharedFromStorage);

    

  }

  AddBooking() {
    this.payServ.addBooking(this.DormID, this.RoomID, this.GuestID, this.CheckinDate, this.CheckoutDate, this.Shared, this.Price)
      .subscribe(() => {
        if (this.Shared) {
          this.router.navigate(['/chooseApartner']);
        } else {
          this.router.navigate(['/bookings']);
        }
      }, (ResponseError: any) => {
        const errorMessage = JSON.parse(ResponseError.error).message;
        console.error(errorMessage);
        this.ReturnedError = errorMessage;
      });

    localStorage.removeItem('RoomID');
    localStorage.removeItem('DormID');
    localStorage.removeItem('Shared');
  }
}
