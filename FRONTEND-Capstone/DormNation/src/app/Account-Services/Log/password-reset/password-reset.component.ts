import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../log.service';
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
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  EmailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/;
  Passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*;])[A-Za-z\d!@#$%^&*;]{6,}$/;


  Email: string;
  password : string;
  OTP_Value : number;

  WrittenError: string;
  EmailError = false;
  Success = false;
  OTPSuccess = false;
  ReturnedError = false;
  PassError = false;

  disablebtn = false;
  hidePassword: boolean = true;

  constructor(private router: Router,
    private authService: AuthService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  
  onSubmitForm(): void {
    if ((this.Success === false && this.OTPSuccess === false)) {
      this.requestOTP();
    } else if (this.Success === true && this.OTPSuccess === false){
      this.sendOTP();
    } else {
      this.changePassword();
    }
  }

  requestOTP(){
    console.log("STrted submit");
    if (this.EmailRegex.test(this.Email)) {
      this.disablebtn = true;
      this.EmailError, this.ReturnedError = false;
      this.authService.requestOTP(this.Email).subscribe(
        (response: string) => {
          this.disablebtn = false;
          console.log("Waiting");
          // alert(response);
          this.Success = true;
          this.ReturnedError = true;
          this.WrittenError = response;
          // this.router.navigate(['/login']);
        },
        (error: LoginError) => {
          console.log("Error");
          this.ReturnedError = true;
          const errorMessage = JSON.parse(error.error).message;
          this.WrittenError = errorMessage;
          console.error("error: " + error.error);
          this.disablebtn = false;
        }
      );
    } else {
      this.WrittenError = "An email should be in the form of email.example@lau.com";
      this.EmailError = true;
    }
  }

  sendOTP() {
      // this.EmailError, this.ReturnedError = false;
      this.OTP_Value = parseInt(this.OTP_Value.toString());
      this.authService.sendOTP(this.Email,this.OTP_Value).subscribe(
        (response: string) => {
          // alert(response);
          this.OTPSuccess = true;
          this.EmailError, this.ReturnedError = false;
        },
        (error: LoginError) => {
          console.log("Error");
          this.ReturnedError = true;
          const errorMessage = JSON.parse(error.error).message;
          this.WrittenError = errorMessage;
          if(this.WrittenError === 'The OTP has expired, redirecting'){
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 5000);
          }
          console.error("error: " + error.error);
        }
      );
  }

  changePassword() {
    if( this.Passwordregex.test(this.password)) {
      this.authService.changePass(this.Email,this.password).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error: LoginError) => {
          console.log("Error");
          this.ReturnedError = true;
          const errorMessage = JSON.parse(error.error).message;
          this.WrittenError = errorMessage;
          console.error("error: " + error.error);
        }
      );
    } else {
      this.WrittenError = 'Your password has to be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 of these !@#$%^&*';
      this.PassError = true;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

}

