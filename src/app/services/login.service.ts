import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginByGoogle(body): Promise<any> {
    return this.http.post(`${environment.baseUrl}/api/auth/googleauthenticate`, body).toPromise();
  }

  loginByFacebook(body): Promise<any> {
    return this.http.post(`${environment.baseUrl}/api/auth/facebookauth`, body).toPromise();
  }
}
