import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @ViewChild('content', {static: false}) content: ElementRef;
  loginModalPopup: NgbModalRef;

  constructor(private toastr: ToastrService, 
    private modalService: NgbModal,
    public auth: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(value) {
    if (this.loginForm.valid) {
      if (value.email === 'admin@yopmail.com' && value.password === 'Admin@123') {
        localStorage.setItem('currentUser', 'token');
        this.auth.currentUser = 'token';
        this.loginModalPopup.close();
      } else{
      this.toastr.error('Invalid credentials', 'errors');
      }
    } else {
      this.toastr.error('Please fill required details', 'errors');

    }
  }

   /* Modal popup */
   openModal(item?) {
    this.loginModalPopup = this.modalService.open(this.content);
  }

}
