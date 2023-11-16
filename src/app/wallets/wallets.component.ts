import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  token: any;
  wallets: any[] = [];
  users: any[] = [];
  filter_config: any;

  walletFilter = '';

  note: any;
  wallet_id: any;

  wallet = {
    user_id: null,
    transaction_id: null,
    refund_transaction_id: null,
    amount: null,
    fee: null,
    note: null,
    create_date: null,
    modified_date: null,
  }

  errorMessage: boolean = false;
  successMessage: boolean = false;

  Swal = require('sweetalert2')

  constructor(private api: ApiService,
    public utility: UtilitiesService, public translate: TranslateService) {
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
    if (this.filter_config.queries) {
      params = params.append('queries', this.filter_config.queries);
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
    const sub = this.api.get('wallets/', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.wallets = objects['wallets'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; this.getUsers(); });
  }

  itemId(id: any, note: any) {
    this.wallet_id = id;
    this.note = note;
  }

  adddNote(id: any) {
    const sub = this.api.update('wallets/' + id + '/note', { note: this.note }, this.token).subscribe(
      async data => { this.getWallets(); },
      async errr => { }
    );
  }

  user_contact: any;
  onChange() {
    if (this.user_contact.length >= 3) {
      let field = 'user_details,email,phone';
      let value = this.user_contact;

      this.filter_config.queries = `${field},like,${value}`;
      this.getUsers();
    }

    if (this.user_contact == '' || this.user_contact == null) {
      this.filter_config.queries = null;
      this.getUsers();
    }
  }

  onSubmit() {
    let body = {
      user_id: this.wallet.user_id,
      transaction_id: this.wallet.user_id,
      amount: this.wallet.amount,
      fee: this.wallet.fee,
      note: this.wallet.note
    }
    const sub = this.api.post('wallets/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
    sub.add(() => { this.getWallets(); });
  }

  async getUsers() {
    const sub = this.api.get('users/', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.users.forEach(function (user) {
          if (user.user_details) {
            let user_details = UtilitiesService.parseIfNotJsonObject(user.user_details);
            user.contact = user_details.name_en ? user_details.name_en : user_details.name_ar ? user_details.name_ar : user.phone;
          }
          else {
            user.contact = user.email ? user.email : user.phone;
          }
        });
      },
      async error => { }
    );
  }

  requestRefund(id: any) {
    this.api.post('wallets/' + id + '/refund', {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );
  }

  searchItems() {
    if (this.walletFilter.length >= 3) {
      let field = 'phone,email,user_details';
      let value = this.walletFilter;

      this.filter_config.queries = `${field},like,${value}`;
      this.getWallets();
    }

    if (this.walletFilter == '' || this.walletFilter == null) {
      this.filter_config.queries = null;
      this.getWallets();
    }
  }

  user_id: any;
  user_param: any;

  onChangeUser() {
    if (this.user_param.length >= 3) {
      const sub = this.api.get('users/search/' + this.user_param, this.token, {}).subscribe(
        async data => {
          let objects: any = {
            users: []
          }
          objects = data;

          this.users = objects.users.users;
          this.users.forEach((user) => {
            user.contact = user.email ? user.email : user.phone;
          });

          this.wallet.user_id = this.users[0].id;
        },
        async error => { }
      );

      sub.add(() => { });
    }
  }

  changeToRefunded(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to change the status to Refund?' : 'هل تريد تغيير الحالة الى تم الاسترجاع؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.update('wallets/status/refund/' + id, {}, this.token).subscribe(
          async data => { 
            Swal.fire({
              title: 'Success',
              text: 'Updates Successfully!'
            })
           },
          async eror => { 
            Swal.fire(
              'Error!',
              'Could not send your request!'
            );
           });
      }
    });
  }
}
