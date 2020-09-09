import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { EventEmitterService } from "../services/event-emitter.service";
import { Subscription } from 'rxjs';

declare const gapi: any;

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
    private localStorageService: LocalStorageService,
    private eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.userDataSub = this.eventEmitterService.userData.subscribe(res => {
      if (res) {
        this.userData = JSON.parse(JSON.stringify(res));
      }
    });
  }

  signOut(): void {
    if (gapi?.auth2?.getAuthInstance()?.currentUser?.get()?.wc) {
      gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
      setTimeout(() => {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
      }, 1000);
    }

    this.localStorageService.clearStorage();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }

  }

}
