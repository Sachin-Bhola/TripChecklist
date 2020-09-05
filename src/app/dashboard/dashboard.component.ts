import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: SocialUser;

  constructor(private authService: SocialAuthService,
    private router: Router,
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.localStorageService.clearStorage();
      this.router.navigate(['/login']);
    });
  }

}
