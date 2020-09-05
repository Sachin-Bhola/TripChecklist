import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setAccessToken(token) {
    localStorage.setItem('token', token);
  }

  getAccessToken() {
    return localStorage.getItem('token');
  }

  clearStorage() {
    localStorage.clear();
  }

}
