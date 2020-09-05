import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    public localStorageService: LocalStorageService
  ) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!state.url.includes('login')) {
      if (this.loginToken()) {
        return true;
      } else {
        this.router.navigate(['login'])
        return false;
      }
    } else {
      if (this.loginToken()) {
        this.router.navigate(['dashboard'])
        return false;
      } else {
        return true;
      }
    }
  }

  loginToken() {
    return this.localStorageService.getAccessToken();
  }


}
  

