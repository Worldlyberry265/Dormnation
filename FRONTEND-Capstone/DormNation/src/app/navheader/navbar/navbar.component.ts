import { Component } from '@angular/core';
import { LogService } from 'src/app/Account-Services/log.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  logs = false;

  constructor (private logSer : LogService,
               private authService : AuthService) {
  }
  
  ngOnInit(){
    if(localStorage.getItem('jwt')){
      this.logs = true;
    } else {
      this.logs = false;
    }
  }

  signUp(){
    // console.log("IM IN SIGNUP");
    this.logSer.Log.next('Register');
    // console.log("IM IN SIGNUP AFTER EMITTING");
  }

  log(){
    if(this.logs){
      this.logout();
    } else {
      this.logIn()
    }
  }
  logIn(){
    // console.log("IM IN login");
    this.logSer.Log.next('Login');
    // console.log("IM IN login after emitting");
  }
  logout(): void {
    this.authService.logout();
}
}
