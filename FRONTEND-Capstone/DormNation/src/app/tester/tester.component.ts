import { Component, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent {


  public start: string = 'year'; // Change to lowercase 'year'
  public depth: string = 'year'; // Change to lowercase 'year'
  public format: string = 'MMM yyyy';
  public minDate: Date = new Date(); // Rename min to minDate
  public maxDate: Date = new Date(new Date().getFullYear() + 2, new Date().getMonth(), 1);
  public startDate: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 28);
  public endDate: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, 28);
  public NumberOfGuests: number = 1;
  public Location: string = 'LAU Beirut';

  @ViewChild('picker') picker: MatDatepicker<Date>; // Reference to MatDatepicker
  
  openCalendar() {
    this.picker.open(); // Open MatDatepicker
  }

}

