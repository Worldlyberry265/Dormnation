import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { HomepageComponent } from './homepage/homepage.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { AppRoutingModule } from './core/app-routing.module';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PropertyListItemComponent } from './property-list/property-list-item/property-list-item.component';
// import { enableRipple, registerLicense } from '@syncfusion/ej2-base';
import { NavbarComponent } from './navheader/navbar/navbar.component';
import { HeaderComponent } from './navheader/header/header.component';
import { PartnerSelectionComponent } from './partner-selection/partner-selection.component';
import { LogComponent } from './Account-Services/Log/Log.component';



// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { MatButtonModule } from '@angular/material/button';
import { FloatingLabelDirective } from './Account-Services/floating-label-directive.directive';
import { LogService } from './Account-Services/log.service';
import { AuthService } from './core/auth/auth.service';
import { AuthClient } from './core/auth/auth.client';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { PasswordResetComponent } from './Account-Services/Log/password-reset/password-reset.component';
import { PropertyDormsComponent } from './property-list/property-list-item/property-dorms/property-dorms.component';
import { CarouselComponent } from './property-list/property-list-item/property-dorms/carousel/carousel.component';
import { PropertyReviewsComponent } from './property-list/property-list-item/property-dorms/property-reviews/property-reviews.component';
import { DormsRoomComponent } from './property-list/property-list-item/property-dorms/dorms-room/dorms-room.component';
import { FooterComponent } from './footer/footer.component';
import { PopupComponent } from './property-list/property-list-item/property-dorms/dorms-room/imagesPopup/popup.component';
import { Dorm } from './models/Dorm.model';
import { LoginError } from './models/Error.model';
import { SafeUrlPipe } from './property-list/property-list-item/property-dorms/Pipes/safe-url.pipe';
import { FormatHoursPipePipe } from './property-list/property-list-item/property-dorms/Pipes/format-hours-pipe.pipe';
import { PaymentComponent } from './property-list/payment/payment.component';
import { BookingsComponent } from './bookings/bookings.component';
import { RegisterYourPropertyComponent } from './register-your-property/register-your-property.component';
import { AuthGuard } from './core/auth/guards/guards.service';


import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TesterComponent } from './tester/tester.component';


// enableRipple(true);

// Apply your Syncfusion license key
// registerLicense('@32342e302e30iRF6MCGugjAkcWm8LpkBNT+hXjH3WZ5EgpItfuiuX00=');
export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PropertyListComponent,
    PropertyListItemComponent,
    NavbarComponent,
    HeaderComponent,
    PartnerSelectionComponent,
    LogComponent,
    FloatingLabelDirective,
    PasswordResetComponent,
    PropertyDormsComponent,
    CarouselComponent,
    PropertyReviewsComponent,
    DormsRoomComponent,
    FooterComponent,
    PopupComponent,
    SafeUrlPipe,
    FormatHoursPipePipe,
    PaymentComponent,
    BookingsComponent,
    RegisterYourPropertyComponent,
    TesterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DateRangePickerModule, 
    // DropDownListModule,
    AppRoutingModule,
    // NgbModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['*'],
        disallowedRoutes: [],
      },
    }),
    // MatButtonModule,
    // MatCardModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatToolbarModule,
    // MatMenuModule,
    // MatIconModule,
    // MatPaginatorModule,
    // MatTableModule,
  ],
  providers: [LogService, AuthService, AuthClient, JwtHelperService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
