import { NgModule } from "@angular/core";
import { Routes , RouterModule} from "@angular/router";
import { HomepageComponent } from "../homepage/homepage.component";
import { PropertyListComponent } from "../property-list/property-list.component";
import { PartnerSelectionComponent } from "../partner-selection/partner-selection.component";
import { LogComponent } from "../Account-Services/Log/Log.component";
import { PasswordResetComponent } from "../Account-Services/Log/password-reset/password-reset.component";
import { PropertyDormsComponent } from "../property-list/property-list-item/property-dorms/property-dorms.component";
import { DormResolverService } from "../dormServices/dorm-resolver.service";
import { PaymentComponent } from "../property-list/payment/payment.component";
import { BookingsComponent } from "../bookings/bookings.component";
import { RegisterYourPropertyComponent } from "../register-your-property/register-your-property.component";
import { AuthGuard } from "./auth/guards/guards.service";
import { TesterComponent } from "../tester/tester.component";

// import { AuthGuard } from "./auth/guards/guards.service";
// import { UserResolverService } from "./user-resolver.service";


const appRoutes: Routes = [
    { path: 'homepage' , component: HomepageComponent},
    { path: 'propertyList' , component: PropertyListComponent},
    { path: 'property-dorms/:id' , component: PropertyDormsComponent, resolve: {dorm : DormResolverService}},
    { path: 'chooseApartner' , component: PartnerSelectionComponent},
    { path: 'signup' , component: LogComponent},
    { path: 'login' , component: LogComponent },
    { path: 'forget-password' , component: PasswordResetComponent},
    { path: 'payment' , canActivate: [AuthGuard], component: PaymentComponent},
    { path: 'bookings' , canActivate: [AuthGuard] , component: BookingsComponent},
    { path: 'register-your-property' , component: RegisterYourPropertyComponent},
    { path: 'tester' , component: TesterComponent},


    // { path: '**' , component: HomepageComponent},
    { path: '' , redirectTo: 'homepage', pathMatch: 'full'},
]

@NgModule({
imports: [RouterModule.forRoot(appRoutes, {
    scrollPositionRestoration: 'enabled',
})],
// imports: [RouterModule.forRoot(appRoutes)],
exports: [RouterModule],
})
export class AppRoutingModule {

}