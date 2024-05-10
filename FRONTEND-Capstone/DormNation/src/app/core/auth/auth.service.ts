import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthClient } from './auth.client';

@Injectable()
export class AuthService {
    // private isloggedinSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // isloggedin$: Observable<boolean> = this.isloggedinSubject.asObservable();
    constructor(private jwthelper: JwtHelperService,
        private router: Router,
        private authclient: AuthClient) {
    }
    // setLoginStatus(status: boolean): void {
    //     this.isloggedinSubject.next(status);
    // }
    isTokenExpired(): Observable<boolean> { //observable
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const decodedToken = this.jwthelper.decodeToken(token);
                const expirationDate = new Date(decodedToken.exp * 1000);
                const currentDate = new Date();
                const isExpired = expirationDate < currentDate;
                console.log("exp date: " + expirationDate);
                console.log("current date: " + currentDate);
                if (isExpired) {
                    this.logout();
                    alert("Your session has expired, please sign in again");
                    return of(true);
                } else {
                    return of(false);
                }
            } catch (error) {
                console.log("Im in error");
                // console.error('Error decoding JWT token:', error);
            }
        }
        return of(true);
        // return Observable<boolean>;
    }
    login(Email: string, password: string): Observable<string> {
        const loginData = {
            email: Email,
            password: password
        };
        return this.authclient.login(loginData);
    }

    logout(): void {
        localStorage.removeItem('jwt');
        localStorage.removeItem('RoomID');
        localStorage.removeItem('DormID');
        localStorage.removeItem('Shared');
        this.router.navigate(['/login']);
    }

    SignUp(Username: string, Email: string, password: string, Gender: string, Age: number): Observable<string> {
        const SignUpData = {
            username: Username,
            email: Email,
            password: password,
            gender: Gender,
            age: Age
        };
        return this.authclient.SignUp(SignUpData);
    }

    requestOTP(Email: string): Observable<string> {
        const EmailData = {
            email: Email,
        };
        return this.authclient.requestOTP(EmailData);
    }
    sendOTP(Email: String, OTP_value: number): Observable<string> {
        const otp = {
            user_Email: Email,
            otp_Value: OTP_value,
            expiration_Timestamp : null
        };
        return this.authclient.sendOTP(otp);
    }
    changePass(Email: String, Password: String): Observable<string> {
        const UserData = {
            email: Email,
            password : Password
        };
        return this.authclient.changePass(UserData);
    }
      
   
   
    containsSpecialCharacters(input: string): boolean {
        const specialCharactersRegex = /[\[\]\'"\\%\/\*=;]/;
        return specialCharactersRegex.test(input);
    }
    // UpdateUser(Id: number, Username: string, Email: string, password: string, Address: string, Roles: string): Observable<string> {
    //     const UpdateUser = {
    //         id: Id,
    //         username: Username,
    //         email: Email,
    //         password: password,
    //         address: Address,
    //         roles: Roles
    //     };
    //     return this.authclient.updateUser(UpdateUser);

    // }
}