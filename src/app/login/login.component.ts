import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;

  Swal = require('sweetalert2')

  loading: boolean = false;

  constructor(
    public utility: UtilitiesService,
    public translate: TranslateService,
    private router: Router, private api: ApiService) {
    this.utility.show = false;
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.removeItem('foo');
    }
  }

  switchLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  login() {
    let email = '';
    let password = null;

    email = this.email;
    password = this.password;

    if (email && password) {
      this.loading = true;

      let body = {
        'email': this.email,
        'password': this.password
      }

      const sub = this.api.login(body, 'login/admin').subscribe(
        async data => {
          let dd = JSON.parse(JSON.stringify(data));
          if (data) {
            let timerInterval
            Swal.fire({
              title: 'Login Successful!',
              html: 'You will be redirected in <b></b> milliseconds.',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading(null);
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                  b.textContent = Swal.getTimerLeft().toString()
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              this.api.setToken(dd);
              this.router.navigate(['home']);
            })
          }
          else {
            Swal.fire({
              title: 'Oops...',
              text: 'Access Denied!'
            })
          }
        },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
          
        }
      );

      sub.add(() => { this.loading = false; })
    }
    else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please Check input data!'
      })
    }
  }
}
