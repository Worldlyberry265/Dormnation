import { Component, Input } from '@angular/core';
import { ImagesPopupService } from './imagesPopup/images-popup.service';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/property-list/payment/payment.service';


@Component({
  selector: 'app-dorms-room',
  templateUrl: './dorms-room.component.html',
  styleUrls: ['./dorms-room.component.css']
})
export class DormsRoomComponent implements OnInit, OnDestroy {

  @Input() RoomInfo: any[] = [];
  @Input() DormId: number;
  // @Input() DisableDueGender : boolean;

  checkin: string;
  checkout: string;
  duration: number;
  NumberOfGuests: number;
  

  PopupDisplay: boolean;
  ShareDisplay: boolean = false;

  private ImgPopSubscription: Subscription;
  constructor(private ImgPopupService: ImagesPopupService, private route: ActivatedRoute, private payService: PaymentService) { }

  ngOnInit(): void {
    this.ImgPopSubscription = this.ImgPopupService.PopupDisplay.subscribe((PopupDisplayValue) => {
      this.PopupDisplay = PopupDisplayValue;

      this.checkin = localStorage.getItem('CheckinDate');
      this.checkout = localStorage.getItem('CheckoutDate');
      this.duration = +localStorage.getItem('duration');
      this.NumberOfGuests = +localStorage.getItem('NumberOfGuests');

    });
  }

  ngOnDestroy(): void {
    this.ImgPopSubscription.unsubscribe();
  }

  showPopup() {
    // this.PopupDisplay = !this.PopupDisplay;
    this.ImgPopupService.PopupDisplay.next(true);
  }

  SendBookingInfo(Shared?: boolean) {
    // this.payService.Shared.next(Shared);
    // this.payService.DormID.next(this.DormId)
    // this.payService.RoomID.next(this.RoomInfo['ID']);
    

    localStorage.setItem('RoomID', this.RoomInfo['ID'].toString());
    localStorage.setItem('DormID', this.DormId.toString());
    localStorage.setItem('Shared', JSON.stringify(Shared));
    localStorage.setItem('Price',  this.RoomInfo['Price'].toString());

    this.ShareDisplay = true;
  }
}
