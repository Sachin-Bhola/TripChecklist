import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  userData = new Subject<any>();

  constructor() { }

  emitUserData(userData) {
    this.userData.next(userData);
  }
  
}
