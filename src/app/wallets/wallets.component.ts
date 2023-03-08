import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  token: any;
  wallets: any[] = [];
  users: any[] = [];
  auctions: any[] = [];
  filter_config: any;

  wallet = {
    user_id: null,
    auction_id: null,
    amount: null
  }

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Wallets Page';
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
    this.getWallets();
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
    this.getWallets();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getWallets();
  }

  getWallets() {
    this.utility.loader = true;
    const sub = this.api.get('wallets/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.wallets = objects['wallets'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; this.getUsers(); });
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

    sub.add(() => { this.getAuctions(); });
  }

  async getAuctions() {
    this.api.get('auctions/active', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions'];
      },
      async error => { }
    );
  }

  user_contact: any;
  onChange() {
    let user = this.users.find(i => i.contact === this.user_contact);
    this.wallet.user_id = user.id;
  }

  onSubmit() {
    let body = {
      user_id: this.wallet.user_id,
      auction_id: this.wallet.auction_id,
      amount: this.wallet.amount
    }
    const sub = this.api.post('wallets/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
    sub.add(() => { this.getWallets(); });
  }
}
