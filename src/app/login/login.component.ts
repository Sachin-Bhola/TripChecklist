import { Component, OnInit, NgZone } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { EventEmitterService } from "../services/event-emitter.service";
import { environment } from 'src/environments/environment';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userInfo: object;
  auth2: any;

  constructor(private localStorageService: LocalStorageService,
    private loginService: LoginService,
    private eventEmitter: EventEmitterService,
    private router: Router,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ngZone.run(() => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: environment.googleClientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.signInGoolge(document.getElementById('googleBtn'));
      });
    });
  }

  signInWithFB(): void {
    this.ngZone.run(() => {
      window['FB'].login((response) => {
        if (response.authResponse) {
          this.userInfo = new Object();
          this.userInfo['authToken'] = response['authResponse']['accessToken'];
          window['FB'].api('/me', {
            fields: 'last_name, first_name, email'
          }, (userInfo) => {
            Object.assign(this.userInfo, userInfo);
            this.logInUser(this.userInfo, 'facebook');
          });
        } else {
          console.log('User login failed');
        }
      }, { scope: 'email' });
    });
  }

  signInGoolge(element) {
    this.ngZone.run(() => {
      this.auth2.attachClickHandler(element, {},
        () => {
          const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
          const profile = googleUser.getBasicProfile();
          this.userInfo = new Object();
          this.userInfo['authToken'] = googleUser['wc']['access_token'];
          this.userInfo['email'] = profile.getEmail();
          this.userInfo['firstName'] = profile.getGivenName();
          this.userInfo['id'] = profile.getId();
          this.userInfo['idToken'] = googleUser['wc']['id_token'];
          this.userInfo['lastName'] = profile.getFamilyName()
          this.userInfo['name'] = profile.getName()
          this.userInfo['photoUrl'] = profile.getImageUrl();
          this.userInfo['provider'] = 'GOOGLE';
          this.logInUser(this.userInfo, 'google');
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
    });
  }

  async logInUser(userDetails, loginWith) {
    try {
      let res;
      if (loginWith === 'google') {
        res = await this.loginService.loginByGoogle(userDetails);
      } else {
        res = await this.loginService.loginByFacebook(userDetails);
      }
      this.localStorageService.setAccessToken(res.token);
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']).then(() => {
          setTimeout(() => {
            this.eventEmitter.emitUserData(res);
          }, 1000);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

}
