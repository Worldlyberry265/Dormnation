import { Component, Input, OnInit } from '@angular/core';
import { DormListService } from 'src/app/dormServices/dorm-list.service';

@Component({
  selector: 'app-property-list-item',
  templateUrl: './property-list-item.component.html',
  styleUrls: ['./property-list-item.component.css']
})
export class PropertyListItemComponent implements OnInit {

  @Input() ID : number;
  @Input() ImgSrc: string;
  @Input() Title: string;
  @Input() Location: string;
  @Input() Rating: number;
  @Input() Stars: number;
  @Input() Parking: boolean;
  @Input() SharedKitchen: boolean;
  @Input() Gender: string;
  @Input() Distance: number;
  @Input() CheapestPrice: number;
  @Input() NumberOfStudents: number;

  @Input() Duration: number;
  starlength: number[] = [];

  // constructor (private dormsService : DormListService){
  //   // this.FullPrice = dormsService.MonthsStayed.;
  // }
  ngOnInit(): void {
    console.log(this.NumberOfStudents)
    for (let i = 0; i < this.Stars; i++) {
      this.starlength.push(0);
    }

  }

}
