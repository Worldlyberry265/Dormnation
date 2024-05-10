import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { ImagesPopupService } from './images-popup.service';

interface carouselImage {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

  disappearPopup : boolean;
  @Input() images: carouselImage[] = [];


  private ImgPopSubscription: Subscription;
  constructor(private ImgPopupService: ImagesPopupService) { }

  
  ngOnInit(): void {
    this.ImgPopSubscription = this.ImgPopupService.PopupDisplay.subscribe((PopupDisplayValue) => {
      this.disappearPopup = PopupDisplayValue;
    });
  }

  ngOnDestroy(): void {
    this.ImgPopSubscription.unsubscribe();
  }


  NavigateFromBackground(event: any) {
    if (event.target === event.currentTarget) {
      // this.disappearPopup = !this.disappearPopup;
      this.ImgPopupService.PopupDisplay.next(false);
    }
  }
}
