import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService as SocialLoginService } from "angularx-social-login";
import { EventEmitterService } from "../services/event-emitter.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  loggedIn: boolean;
  userDataSub: Subscription;
  userData: object;

  constructor(private router: Router,
    private socialLoginService: SocialLoginService,
    private localStorageService: LocalStorageService,
    private eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    console.log(this.userData)
    this.userDataSub = this.eventEmitterService.userData.subscribe(res => {
      if (res) {
        this.userData = JSON.parse(JSON.stringify(res));
      }
    });
  }

  signOut(): void {
    this.socialLoginService.signOut().then(() => {
      this.localStorageService.clearStorage();
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy() {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();  
    }

  }

}
