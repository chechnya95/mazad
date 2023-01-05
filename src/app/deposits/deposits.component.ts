import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.css']
})
export class DepositsComponent implements OnInit {

  token: any;
  deposits: any[] = [];
  users: any[] = [];
  filter_config: any;

  depositFilter = '';

  note: any;
  deposit_id: any;

  deposit = {
    user_id: null,
    transaction_id: null,
    amount: null,
    fee: null,
    note: null,
  }

  errorMessage: boolean = false;
  successMessage: boolean = false;

  Swal = require('sweetalert2')

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Deposits Page';
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
    this.getDeposits();
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
    this.getDeposits();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getDeposits();
  }

  getDeposits() {
    this.utility.loader = true;
    const sub = this.api.get('deposits/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.deposits = objects['deposits'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        
      }
    );

    sub.add(() => { this.utility.loader = false; this.getUsers(); });
  }

  itemId(id: any, note: any) {
    this.deposit_id = id;
    this.note = note;
  }

  adddNote(id: any) {
    const sub = this.api.update('deposits/' + id + '/note', { note: this.note }, this.token).subscribe(
      async data => { this.getDeposits(); },
      async errr => {  }
    );
  }

  user_contact: any;
  onChange() {
    let user = this.users.find(i => i.contact === this.user_contact);
    this.deposit.user_id = user.id;
  }

  onSubmit() {
    let body = {
      user_id: this.deposit.user_id,
      transaction_id: this.deposit.user_id,
      amount: this.deposit.amount,
      fee: this.deposit.fee,
      note: this.deposit.note
    }
    const sub = this.api.post('deposits/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => {  this.errorMessage = true; }
    );
    sub.add(() => { this.getDeposits(); });
  }

  async getUsers() {
    const sub = this.api.get('users/', this.token).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.users.forEach(function (user) {
          if (user.user_details) {
            let user_details = JSON.parse(user.user_details);
            user.contact = user_details.name_en ? user_details.name_en : user_details.name_ar ? user_details.name_ar : user.phone;
          }
          else {
            user.contact = user.email ? user.email : user.phone;
          }
        });
      },
      async error => {
        
      }
    );
  }

  requestRefund(id: any) {
    this.api.post('deposits/' + id + '/refund', {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => {  this.errorMessage = true; }
    );
  }
}
