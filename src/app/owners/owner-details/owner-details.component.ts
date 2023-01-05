import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrls: ['./owner-details.component.css']
})
export class OwnerDetailsComponent implements OnInit {

  token: any;

  auctions: any[] = [];
  users: any[] = [];
  owner_users: any[] = [];
  owner: any;

  filter_config: any;

  user_id: any;
  user_param: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Owner Details';
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
        let objects = localStorage.getItem('owners') ? JSON.parse(localStorage.getItem('owners')) : null;
        if (objects) {
          this.owner = objects.find(i => i.id === id);

          this.owner.details = this.owner.owner_details;
          this.getOwnerUsers();
        }
      }
      else { this.router.navigate(['owners']); }
    })
  }

  async getUsers() {
    this.api.get('users/', this.token).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.users.forEach(function (user) {
          user.contact = user.email ? user.email : user.phone;
        });
      },
      async error => {
        alert(error);
      }
    );
  }

  getOwnerUsers() {
    this.utility.loader = true;
    const sub = this.api.get('owners/owner_user/' + this.owner.id, this.token).subscribe(
      async data => {
        let objects: any = {
          owner_user: []
        }
        objects = data;
        this.owner_users = objects.owner_user;
      },
      async error => {  this.errorMessage = true; }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  linkUser(id: any) {
    let body = {
      user_id: this.user_id,
      owner_id: id
    }
    this.api.post('owners/owner_user', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getOwnerUsers();
      },
      async error => {  this.errorMessage = true; }
    );
  }

  deleteOwnerUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete user!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete("owners/owner_user/" + id, this.token).subscribe(
          async data => {
            this.getOwnerUsers();
          },
          async error => {
            this.errorMessage = true;
            
          }
        );
      }
    });
  }

  onChangeUser() {
    if (this.user_param.length >= 3) {
      const sub = this.api.get('users/search/' + this.user_param, this.token, this.getHttpParams()).subscribe(
        async data => {
          let objects: any = {
            users: []
          }
          objects = data;

          this.users = objects.users.users;
          this.users.forEach((user) => {
            user.contact = user.email ? user.email : user.phone;
          });
        },
        async error => {  }
      );

      sub.add(() => { });
    }
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
}
