import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  token: any;
  users: any[] = [];
  roles: any[] = [];
  filter_config: any;

  user = {
    email: null,
    password: null,
    phone: null,
    role: null,
    user_type: 'USER',
    status: 0
  }

  edit_user_id: any;
  edit_user = {
    email: null,
    password: null,
    phone: null,
    role: null,
    user_type: null,
    role_id: null,
    status: 0
  }

  user_details = {
    name_ar: null,
    name_en: null,
    id_card_number: null
  }

  edit_user_details = {
    name_ar: null,
    name_en: null,
    id_card_number: null
  }

  userFilter = '';
  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Users';
    this.token = localStorage.getItem('access_token');
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getUsers(id);
      }
      else { this.getUsers(); }
    })
  }
  getHttpParams() {
    let params = new HttpParams();
    params = params.append('page', this.filter_config.currentPage.toString());
    params = params.append('per_page', this.filter_config.itemsPerPage.toString());
    if (this.filter_config.sort) {
      params = params.append('sort', this.filter_config.sort);
      params = params.append('sort_order', this.filter_config.sort_order);
    }
    return params;
  }

  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getUsers();
  }

  async getUsers(id?: any) {
    this.utility.loader = true;
    const sub = this.api.get('users/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.filter_config.totalItems = objects['filters']['total_results'];
        localStorage.setItem('users', JSON.stringify(this.users));

        if (id)
          this.users = this.users.filter(i => i.id === id);

        this.users.forEach(function (user) {
          let user_details = JSON.parse(user['user_details']);

          user.avatar = user_details ? user_details['name_en'] ? user_details['name_en'].charAt(0) : user['username'].charAt(0) : user['username'].charAt(0);
          user.name = user_details ? user_details['name_en'] : '';
        });
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { this.utility.loader = false; this.getRoles(); });
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
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);;
      }
    );
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getUsers(null);
  }

  OnSubmit() {
    let role = this.roles.find(i => i.id == this.user.role);
    let body = {
      email: this.user.email,
      password: this.user.password,
      username: this.user.phone, //this.user_details.name_en.substr(0, this.user_details.name_en.indexOf(' ')),
      phone: this.user.phone,
      role: role.name,
      user_type: this.user.user_type,
      user_details: JSON.stringify(this.user_details),
      status: this.user.status
    }

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.user.email == '' || this.user.password == '') {
      Swal.fire({
        title: 'Note...',
        text: 'No enough data!'
      });
    }
    else if (emailPattern.test(String(this.user.email).toLowerCase()) != true) {
      Swal.fire({
        title: 'Note...',
        text: 'email format is not correct!'
      });
    }
    else {
      this.api.post("users/admin", body, this.token).subscribe(
        async data => {
          this.getUsers();
        },
        async error => {
          Swal.fire({
            title: 'Error...',
            text: 'ERROR: cannot connect!\nPlease Note: (email) and (phone) cannot be duplicated!'
          });
        }
      );
    }
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete user!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete("users/" + id, this.token).subscribe(
          res => {
            Swal.fire(
              'Success!',
              'Request Sent Successflly!'
            );
            this.getUsers();
          },
          err => {
            Swal.fire(
              'Error!',
              'Could not send your request!'
            );
            console.log(err);
          });
      }
    });
  }

  editUserClicked(user: any) {
    this.edit_user = user;
    this.edit_user_id = user.id;

    if (this.edit_user['user_details'])
      this.edit_user_details = JSON.parse(this.edit_user['user_details']);

    this.edit_user.status = user.is_active == true ? 1 : 0;
    this.edit_user.role_id = this.roles.find(i => i.name === user.role).id;
  }

  OnUpdate(id: any) {
    let role = this.roles.find(i => i.id == this.edit_user.role_id);
    let body = {
      role: role.name,
      user_details: JSON.stringify(this.edit_user_details),
      user_type: this.edit_user.user_type,
      status: this.edit_user.status
    }

    const sub = this.api.update('users/admin/' + id, body, this.token).subscribe(
      async data => { },
      async errr => { console.log(errr); }
    );

    sub.add(() => { this.getUsers(); });
  }

  disableUser(id: any, is_active: any) {
    let body = { active: (is_active - 1) * (-1) }
    let status = is_active == 0 ? 'Enable' : 'Disable';

    if (confirm(status + " this User?")) {
      this.api.update("users/disable/" + id, body, this.token).subscribe(
        async data => {
          this.getUsers();
        },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
          console.log(error);
        }
      );
    }
  }
}
