import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../log.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

interface LoginError {
  // status: number;
  error: string;
  // message: string;
  // path: string;
  // timestamp: Date,
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  UserRegex = /^[A-Za-z ]+$/;
  EmailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/;
  Passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*;])[A-Za-z\d!@#$%^&*;]{6,}$/;


  Username: string;
  password: string;
  Email: string;
  gender: string = null;
  age: number;

  WrittenError: string;

  UserError = false;
  EmailError = false;
  PassError = false;

  ReturnedError = false;
  private logSubscription: Subscription;
  Log: string;



  hidePassword: boolean = true;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private logSer: LogService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    // console.log("component intiated");
    const currentUrl = this.router.url;

    if (currentUrl.includes('/signup')) {
      this.logSer.Log.next('Register');
    } else {
      this.logSer.Log.next('Login');
    }

    this.logSubscription = this.logSer.Log.subscribe((Logvalue) => {
      this.Log = Logvalue;
      // console.log("loGVALUE: " + Logvalue);
      // console.log("lOG: " + this.Log);
    });
  }

  ngOnDestroy(): void {
    this.logSubscription.unsubscribe();
  }

  onSubmitForm(): void {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/signup')) {
      this.onSignUp();
    } else {
      this.onLogin();
    }
  }

  onSignUp(): void {
    if (this.Passwordregex.test(this.password)) {
      if (this.UserRegex.test(this.Username)) {
        if (this.EmailRegex.test(this.Email)) {
          this.PassError, this.UserError, this.EmailError, this.ReturnedError = false;
          // console.log("Username: " + this.Username);
          // console.log("Email: " + this.Email);
          // console.log("Password: " + this.password);
          // console.log("Gender: " + this.gender);
          // console.log("Age: " + this.age);
          this.authService.SignUp(this.Username, this.Email, this.password, this.gender, this.age).subscribe(
            (response: string) => {
              alert(response);
              this.router.navigate(['/login']);
            },
            (error: LoginError) => {
              this.ReturnedError = true;
              const errorMessage = JSON.parse(error.error).message;
              this.WrittenError = errorMessage;
              console.error("error: " + error.error);
            }
          );
        } else {
          this.WrittenError = "An email should be in the form of email.example@lau.com";
          this.EmailError = true;
        }
      } else {
        this.WrittenError = "Invalid Username, Only Letters and spaces are allowed";
        this.UserError = true;
      }
    } else {
      this.WrittenError = 'Your password has to be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 of these !@#$%^&*';
      this.PassError = true;
    }
  }

  onLogin() {
    if (this.Passwordregex.test(this.password)) {
      if (this.EmailRegex.test(this.Email)) {
        this.PassError, this.EmailError, this.ReturnedError = false;
        console.log("Email: " + this.Email);
        console.log("Password: " + this.password);
        this.authService.login(this.Email, this.password).subscribe(
          (response: string) => {
            console.log('jwt: ' + response);
            localStorage.setItem('jwt', response);
            // this.authservice.setLoginStatus(true); 
            if (localStorage.getItem("RoomID")) {
              this.router.navigate(['/payment']);
          } else{
            this.router.navigate(['/propertyList']);
          }
          },

          (error: LoginError) => {
            this.ReturnedError = true;
            const errorMessage = JSON.parse(error.error).message;
            this.WrittenError = errorMessage;
            console.error("error: " + error.error);
            console.log("Email: " + this.Email);
            console.log("Password: " + this.password);
          }

        );
      } else {
        this.WrittenError = "An email should be in the form of email.example@lau.com";
        this.EmailError = true;
      }
    } else {
      this.WrittenError = 'Your password has to be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 of these !@#$%^&*';
      this.PassError = true;
    }
  }

  changeLog() {
    if (this.Log == 'Register') {
      // console.log("change log here");
      this.logSer.Log.next('Login');
      this.router.navigate(['/login'])
    } else {
      // console.log("change log here");

      this.logSer.Log.next('Register');
      this.router.navigate(['/signup'])
    }
  }



  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
