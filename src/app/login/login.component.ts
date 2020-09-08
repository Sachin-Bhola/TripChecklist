import { Component, OnInit, EventEmitter } from '@angular/core';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AuthService as SocialLoginService } from "angularx-social-login";
import { EventEmitterService } from "../services/event-emitter.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private localStorageService: LocalStorageService,
    private loginService: LoginService,
    private socialLoginService: SocialLoginService,
    private eventEmitter: EventEmitterService,
    private router: Router) { }

  ngOnInit(): void {
  }

  signInWithGoogle(): void {
    this.socialLoginService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      if (res) {
        this.logInUser(res,'google');
      }
    });
  }

  signInWithFB(): void {
    this.socialLoginService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      if (res) {
        this.logInUser(res,'facebook');
      }
    });
  }

  async logInUser(userDetails,loginWith) {
    try {
      let res;
      if (loginWith === 'google') {
       res = await this.loginService.loginByGoogle(userDetails);
      } else {
        res = await this.loginService.loginByFacebook(userDetails);
      }
      this.localStorageService.setAccessToken(res.token);
      this.router.navigate(['/dashboard']).then(() => {
        setTimeout(() => {
          this.eventEmitter.emitUserData(res);
        }, 1000);
      });
    } catch (error) {
      console.log(error);
    }
  }

}
