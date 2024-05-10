import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit{

  @Input() Enablefade: boolean = true;
  @Input() images: String[] = [];

  selectedIndex = 0;
  dotsCount = [0,0,0,0,0];
  dotsIndex = 0;

  ngOnInit(): void {
    setInterval( () => {
      this.onNextClick();
    }, 5000);
  }

  // sets index of image on dot/indicator click
  selectImage(index : number) {
    this.selectedIndex = index;
  }
  onPrevClick(){
    if(this.dotsIndex === 0){
      this.dotsIndex = this.dotsCount.length - 1;
    } else {
      this.dotsIndex--;
    }
    if(this.selectedIndex === 0){
      this.selectedIndex = this.images.length - 1;
    } else {
      this.selectedIndex--;
    }
  }

  onNextClick() {
    if(this.dotsIndex === this.dotsCount.length - 1){
      this.dotsIndex = 0;
    } else {
      this.dotsIndex++;
    }
    if(this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++; 
    }
  }
}
