import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  DateRangePickerComponent,
  CalendarView,
} from '@syncfusion/ej2-angular-calendars';
import { AuthService } from '../core/auth/auth.service';
import { Dorm } from '../models/Dorm.model';
import { LoginError } from '../models/Error.model';
import { Router } from '@angular/router';
import { DormListService } from '../dormServices/dorm-list.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';




@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  
  public start: CalendarView = 'Year';
  public depth: CalendarView = 'Year';
  public format: string = 'MMM yyyy';
  public min: Date = new Date(); // Set the minimum selectable month to the current month and year
  public max: Date = new Date(new Date().getFullYear() + 2, new Date().getMonth(), 1);
  @ViewChild('daterangepicker') dateRangePicker: DateRangePickerComponent;
  openCalendar() {
    this.dateRangePicker.show();
  }

  calendarDate: Date; //Useless, just for form validation

  public fullYear: number = new Date().getFullYear();
  public month: number = new Date().getMonth();
  public startDate: Date = new Date(this.fullYear, this.month  , 28);
  public endDate: Date = new Date(this.fullYear, this.month + 1, 28);
  NumberOfGuests: number = 1;
  Location: string = 'LAU Beirut';

  // public start: string = 'year'; // Change to lowercase 'year'
  // public depth: string = 'year'; // Change to lowercase 'year'
  // public format: string = 'MMM yyyy';
  // public minDate: Date = new Date(); // Rename min to minDate
  // public maxDate: Date = new Date(new Date().getFullYear() + 2, new Date().getMonth(), 1);
  // public startDate: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 28);
  // public endDate: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, 28);
  // public NumberOfGuests: number = 1;
  // public Location: string = 'LAU Beirut';

  // // public calendarFormControl = new FormControl(); // FormControl for validation

  // @ViewChild('picker') picker: MatDatepicker<Date>; // Reference to MatDatepicker

  // openCalendar() {
  //   this.picker.open(); // Open MatDatepicker
  // }

  constructor(private dormService: DormListService) {
  }


  onSearchForm() {
    // onSearchForm(Location, StartDate, EndDate, NumberOfGuests, PriceDist?: string, Rating?: string, Gender?: string, SharedKitchen?: boolean, Parking?: boolean) {  
    // this.startDate = this.dateRangePicker.startDate;
    // this.endDate = this.dateRangePicker.endDate;

    
    localStorage.setItem('Location', this.Location);
    console.log("new version")
    console.log(this.startDate);
    this.dormService.onSearchForm(this.Location, this.startDate, this.endDate, this.NumberOfGuests, "default", 0, "default", false, false);
    console.log("im out of homepage")






    // const startDate = new Date('2024-02-01T00:00:00.000Z'); // Create a Date object for February 1, 2024
    // const endtDate = new Date('2024-03-01T00:00:00.000Z'); // Create a Date object for March 1, 2024

    // localStorage.setItem('Location', this.Location);
    // console.log(this.startDate);
    // console.log(startDate);

    // this.dormService.onSearchForm(this.Location, startDate, endtDate, this.NumberOfGuests, "default", 0, "default", false, false);
    // console.log("im out of homepage")

  }

}
