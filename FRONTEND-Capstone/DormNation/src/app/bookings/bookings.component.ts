import { Component, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {


  bookings : Object[];
  pastBookings : Object[];

  
  constructor(private jwthelper: JwtHelperService, private bookServ : BookingService) { }

  ngOnInit(): void {

    const token = localStorage.getItem('jwt');
    const decodedToken = this.jwthelper.decodeToken(token);
      const GuestID = decodedToken.ID;

      this.bookServ.getBooking(GuestID).subscribe(
        (bookings: Object[]) => {
          const currentDate = new Date();
          this.bookings = this.formatDates(
            bookings.filter(booking => new Date(booking['Checkout']) >= currentDate)
          );
          this.pastBookings = this.formatDates(
            bookings.filter(booking => new Date(booking['Checkout']) < currentDate)
          );
        }
      );
    }
  
    private formatDate(date: Date): string {
      const options: any = { month: 'short', year: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  
    private formatDates(bookings: Object[]): Object[] {
      return bookings.map(booking => {
        // Assuming 'Checkin' and 'Checkout' are the date properties in your object
        const formattedCheckin = this.formatDate(new Date(booking['Checkin']));
        const formattedCheckout = this.formatDate(new Date(booking['Checkout']));
  
        return { ...booking, Checkin: formattedCheckin, Checkout: formattedCheckout };
      });
    }
}

// endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);