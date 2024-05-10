import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
// import { CalendarView, DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { Dorm } from '../models/Dorm.model';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DormListService } from '../dormServices/dorm-list.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { CalendarView, DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit, OnDestroy {

  public start: CalendarView = 'Year';
  public depth: CalendarView = 'Year';
  public format: string = 'MMM yyyy';

  public min: Date = new Date(); // Set the minimum selectable month to the current month and year
  public max: Date = new Date(new Date().getFullYear() + 2, new Date().getMonth(), 1);

  @ViewChild('daterangepicker') dateRangePicker: DateRangePickerComponent;

  public fullYear: number = new Date().getFullYear();
  public month: number = new Date().getMonth();
  public startDate: Date = new Date(this.fullYear, this.month  , 28);
  public endDate: Date = new Date(this.fullYear, this.month + 1, 28);

  // public start: string = 'year'; // Change to lowercase 'year'
  // public depth: string = 'year'; // Change to lowercase 'year'
  // public format: string = 'MMM yyyy';
  // public minDate: Date = new Date(); // Rename min to minDate
  // public maxDate: Date = new Date(new Date().getFullYear() + 2, new Date().getMonth(), 1);

  // public startDate: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 28);
  // public endDate: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, 28);

  // @ViewChild('picker') picker: MatDatepicker<Date>; // Reference to MatDatepicker

  private ReturnedErrorSubscription: Subscription;
  ReturnedError: String = '';
  private DormListSubscription: Subscription;
  Dorms: Dorm[];
  private DuratonOfStaySubscription: Subscription;
  Duration: number;
  private CheckinDateSubscription: Subscription;
  CheckinDate: string; 
  private CheckoutDateSubscription: Subscription;
  CheckoutDate: string;

  sortByPriceDist = "default";
  filterByRating = 0;
  filterByGender = "default";
  filterBySharedKitchen = false;
  filterByParking = false;

  Destination: string = " ";

  SearchedTitle = "";
  FoundTitleORLoc = [];
  minPrice: number;
  maxPrice: number;
  NumberOfGuests = 0;

  calendarDate: Date; //Useless, just for form validation

  constructor(private dormListService: DormListService, private authService: AuthService) { }


  ngOnInit(): void {
    this.NumberOfGuests = +localStorage.getItem('NumberOfGuests');

    this.Destination = localStorage.getItem('Location');
    console.log(this.Destination);
    this.SearchedTitle = this.Destination;

    this.ReturnedErrorSubscription = this.dormListService.ReturnedError.subscribe((responseError: string) => {
      if (responseError) {
        this.ReturnedError = responseError;
        localStorage.removeItem('dorms');
        this.Dorms = [];
      }
    });

    const dormsString = localStorage.getItem('dorms');
    if (dormsString) {
      this.Dorms = JSON.parse(dormsString);
    }

    this.DormListSubscription = this.dormListService.DormsSearchResult.subscribe((Dorms: Dorm[]) => {
      if (Dorms.length > 0) {
        this.Dorms = Dorms;
        this.ReturnedError = '';
      }
    });


    const durString = localStorage.getItem('duration');
    if (durString) {
      this.Duration = +durString;
      // or
      // this.Duration = JSON.parse(durString);
    }

    this.DuratonOfStaySubscription = this.dormListService.DuratonOfStay.subscribe((duration: number) => {
      if (duration > 0) {
        this.Duration = duration;
      }
    });

    this.CheckinDate = localStorage.getItem('CheckinDate');

    this.CheckinDateSubscription = this.dormListService.CheckinDate.subscribe((checkindate: string) => {
      if (checkindate) {
        this.CheckinDate = checkindate;
      }
    });

    this.CheckoutDate = localStorage.getItem('CheckoutDate');

    this.CheckoutDateSubscription = this.dormListService.CheckoutDate.subscribe((checkoutdate: string) => {
      if (checkoutdate) {
        this.CheckoutDate = checkoutdate;
      }
    });
  }



  onSearchForm() {
    this.dormListService.onSearchForm(localStorage.getItem('Location'), this.CheckinDate, this.CheckoutDate, this.NumberOfGuests, this.sortByPriceDist, this.filterByRating, this.filterByGender, this.filterBySharedKitchen, this.filterByParking, this.minPrice, this.maxPrice);
  }

  openCalendar() {
    this.dateRangePicker.open();
  }

  resetForm(FilterForm: NgForm) {
    FilterForm.resetForm();
    this.sortByPriceDist = "default";
    this.filterByRating = 0;
    this.filterByGender = "default";
    this.filterBySharedKitchen = false;
    this.filterByParking = false;
  }

  SearchForTitle(SearchedTitleORLocation: string) {
    if (!this.authService.containsSpecialCharacters(SearchedTitleORLocation)) {
      this.dormListService.DormsTitleSearch(SearchedTitleORLocation).subscribe(
        (Titles: string[]) => {
          this.FoundTitleORLoc = Titles;
        },
        // (error) => {
        //   console.log("ERROR: " + error.message);
        //   this.ErrorFound = true;
        //   this.WrittenError = error.message;
        // }
      );

    }
  }


  selectOption(SelectedTitle: string) {
    this.SearchedTitle = SelectedTitle;
    this.FoundTitleORLoc = [];
  }

  getOptionStyle(SearchedTitle: string) {
    if (SearchedTitle === 'LAU Beirut' || SearchedTitle === 'LAU Byblos'
      || SearchedTitle === 'AUB' || SearchedTitle === 'USJ'
      || SearchedTitle === 'BAU' || SearchedTitle === 'RHU' || SearchedTitle === 'Any University') {

      const style: any = {
        'font-weight': 700,
      };
      return style;
    }
  }

  submitSearchForm() {
    if (this.minPrice === this.maxPrice && this.minPrice != 0) {
      this.maxPrice = this.minPrice + 50;
    }
    let loc = this.SearchedTitle;
    localStorage.setItem('Location', this.SearchedTitle);
    console.log("endDate before rounding FROM PROPERTY LIST: " + this.CheckoutDate);
    console.log("startDate before rounding FROM PROPERTY LIST: " + this.CheckinDate);
    if (this.SearchedTitle === "Any University") {
      loc = "Any";
    }
    // this.CheckinDate = this.dateRangePicker.startDate.toString();
    // this.CheckoutDate = this.dateRangePicker.endDate.toString();
    this.dormListService.onSearchForm(loc, this.CheckinDate, this.CheckoutDate, this.NumberOfGuests, "default", 0, "default", false, false, this.minPrice, this.maxPrice);
  }

  ngOnDestroy(): void {
    this.DormListSubscription.unsubscribe();
    this.ReturnedErrorSubscription.unsubscribe();
    this.DuratonOfStaySubscription.unsubscribe();
    this.CheckinDateSubscription.unsubscribe();
    this.CheckoutDateSubscription.unsubscribe();

  }


}
