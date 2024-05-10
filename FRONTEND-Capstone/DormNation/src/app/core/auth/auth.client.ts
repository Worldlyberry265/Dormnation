import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/enviroments/enviroments';
import { Dorm } from 'src/app/models/Dorm.model';
// import { User } from 'src/app/model/user';

@Injectable()
export class AuthClient {

    LoginURL = baseUrl + 'Login';
    RegisterURL = baseUrl + 'Register';
    requestOTPURL = baseUrl + 'requestOTP';
    sendOTPURL = baseUrl + 'verifyOTP';
    changePassURL = baseUrl + 'changePass';
    MainSearchEngineURL = baseUrl + 'homepage/MainSearchEngine/';
    DormsTitleSeachURL = baseUrl + 'propertyList/'; // I REMOVED ()
    getDormURL = baseUrl + 'propertyList/getDorm/';
    AddBookingURL = baseUrl + 'payment/addBooking';
    getBookingURL = baseUrl + 'bookings/getBookings/';

    constructor(private http: HttpClient) {
    }
    login(loginData): Observable<string> {
        return this.http.post(this.LoginURL, loginData, { responseType: "text" });
    }

    SignUp(SignUpData): Observable<string> {
        return this.http.post(this.RegisterURL, SignUpData, { responseType: "text" });
    }

    requestOTP(EmailData): Observable<string> {
        return this.http.post(this.requestOTPURL, EmailData, { responseType: "text" });
    }
    sendOTP(otp): Observable<string> {
        return this.http.post(this.sendOTPURL, otp, { responseType: 'text' });
    }
    changePass(User): Observable<string> {
        return this.http.post(this.changePassURL, User, { responseType: 'text' });
    }
    MainSearch(Location : String , startDate : String , endDate : String , NumberOfGuests : number, PriceDist ?: string, Rating ?: number,  Gender ?: string, SharedKitchen ?: boolean, Parking ?: boolean, minPrice ?: number, maxPrice ?: number): Observable<Object[]> {  
        return this.http.get<Dorm[]>(this.MainSearchEngineURL + Location + "/" + startDate + "/" + endDate + "/" + NumberOfGuests + "/" + PriceDist + "/" + Rating + "/" + Gender + "/" + SharedKitchen + "/" + Parking+ "/" + minPrice + "/" + maxPrice );
    }
    DormTilteSearch(SearchedTitle : string) : Observable<string[]> {
        return this.http.get<string[]>(this.DormsTitleSeachURL + SearchedTitle);
    }

    getDorm(id : number, startDate : String , endDate : String , NumberOfGuests : number ) : Observable<Object>{
        return this.http.get<Object>(this.getDormURL + id + "/" + startDate + "/" + endDate + "/" + NumberOfGuests);
    }

    addBooking(BookingInfo): Observable<string> {
        return this.http.post(this.AddBookingURL, BookingInfo, { responseType: "text" });
    }

    getBooking(id : number) : Observable<Object>{
        return this.http.get<Object>(this.getBookingURL + id );
    }
       
}

