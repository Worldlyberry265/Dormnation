import { Component } from '@angular/core';
import { DormListService } from '../dormServices/dorm-list.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-partner-selection',
  templateUrl: './partner-selection.component.html',
  styleUrls: ['./partner-selection.component.css']
})
export class PartnerSelectionComponent {

  FoundTitleORLoc = [];

  constructor(private dormListService: DormListService, private authService: AuthService) { }


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
}
