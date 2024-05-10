import { Component, Input } from '@angular/core';

interface ReviewStructure {
  revName: string;
  revRating: number;
  revDesc: string;
}

@Component({
  selector: 'app-property-reviews',
  templateUrl: './property-reviews.component.html',
  styleUrls: ['./property-reviews.component.css']
})
export class PropertyReviewsComponent {

  @Input() reviews: ReviewStructure[] = [];

  fivelength = [0,0,0,0,0];

  selectedIndex = 0;

  onPrevClick(){
   
    if(this.selectedIndex === 0){
      this.selectedIndex = this.reviews.length - 1;
    } else {
      this.selectedIndex--;
    }
  }

  onNextClick() {
    if(this.selectedIndex === this.reviews.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++; 
    }
  }
}
