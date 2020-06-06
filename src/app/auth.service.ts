import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser = localStorage.getItem('currentUser');
  constructor() { }

  logOut(){
    localStorage.clear();
    this.currentUser = null;
  }
}
