import { AuthService } from './../../../auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginComponent } from 'src/app/login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('loginModal', {static: false}) loginChild: LoginComponent;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  openAttachment() {
    this.loginChild.openModal();
  }

}
