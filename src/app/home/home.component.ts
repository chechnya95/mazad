import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: any;
  roles: any[] = [];

  user = {
    email: null,
    password: null,
    phone: null,
    role: null,
    status: 0
  }

  user_details = {
    name_ar: null,
    name_en: null,
    id_card_number: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      window.location.reload();
    }

    this.getRoles();
  }

  async getRoles() {
    this.api.get('users/roles', this.token).subscribe(
      async data => {
        let objects: any = {
          roles: []
        }
        objects = data;
        this.roles = objects.roles;
      },
      async error => {
        alert(error);
      }
    );
  }

  OnSubmit() {
    let role = this.roles.find(i => i.id == this.user.role);
    let body = {
      email: this.user.email,
      password: this.user.password,
      username: this.user.phone, //this.user_details.name_en.substr(0, this.user_details.name_en.indexOf(' ')),
      phone: this.user.phone,
      role: role.name,
      user_details: JSON.stringify(this.user_details),
      status: this.user.status
    }

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.user.email == '' || this.user.password == '') {
      alert('No enough data');
    }
    else if (emailPattern.test(String(this.user.email).toLowerCase()) != true) {
      alert('email is not correct!');
    }
    else {
      this.api.post("users/admin", body, this.token).subscribe(
        async data => {
          // show message
        },
        async error => {
          alert("ERROR: cannot connect!\nPlease Note: (email) and (phone) cannot be duplicated!");
        }
      );
    }
  }
}
