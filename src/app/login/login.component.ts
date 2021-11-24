import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;

  constructor(
    public utility: UtilitiesService,
    private router: Router, private api: ApiService) {
    this.utility.show = false;
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.removeItem('foo');
    }
  }

  login() {
    let email = '';
    let password = null;

    email = this.email;
    password = this.password;

    if (email && password) {

      let body = {
        'email': this.email,
        'password': this.password
      }

      this.api.login(body, 'login/admin').subscribe(
        async data => {
          let dd = JSON.parse(JSON.stringify(data));
          if (data) {
            this.api.setToken(dd);
            this.router.navigate(['home']);
          }
          else {
            alert("Access Denied");
          }
        },
        async error => {
          alert(error.error);
        }
      );
    }
    else {
      alert('Please Try Again');
    }
  }
}
