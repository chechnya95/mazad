import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;

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
            this.api.setToken(dd);
            this.router.navigate(['home']);
          }
          else {
            alert("Access Denied");
          }
        },
        async error => {
          alert('Error: cannot login');
        }
      );

      sub.add(() => { this.loading = false; })
    }
    else {
      alert('Please Try Again');
    }
  }
}
