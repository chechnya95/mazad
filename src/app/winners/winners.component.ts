import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.css']
})
export class WinnersComponent implements OnInit {

  token: any;
  winners: any[] = [];

  template: any;
  filter_config: any;

  sms = {
    mobile: null,
    user_id: null,
    local: 'AR',
    status: 'pending',
    message: null
  }

  Swal = require('sweetalert2');
  itemFilter: any;

  start_date: any;
  end_date: any;

  constructor(public api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Winners Page';
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
    this.getWinners();
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
    if (this.filter_config.queries_2) {
      params = params.append('queries', this.filter_config.queries_2);
    }
    return params;
  }
  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getWinners();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getWinners();
  }

  getWinners() {
    this.utility.loader = true;
    const sub = this.api.get('bids/winners', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.winners = objects['winners']['bids'];
        this.filter_config.totalItems = objects['winners']['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.getSMSTempalte(); this.utility.loader = false; });
  }

  getSMSTempalte() {
    this.api.get('templates_contents/key/auction_win', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.template = objects['templates_contents'][0];

        this.sms.message = this.template.content.ar;
      },
      async error => { }
    );
  }

  getUser(user_id: any, mobile: any, amount: any) {
    this.sms.message = this.sms.message.replace('{{total}}', amount);

    this.sms.mobile = '968' + mobile;
    this.sms.user_id = user_id;
  }

  getMessage() {
    if (this.sms.local == 'EN') {
      this.sms.message = this.template.content.en;
    }
    else {
      this.sms.message = this.template.content.ar;
    }
  }

  sendNotification() {
    let body = {
      mobile: this.sms.mobile,
      user_id: this.sms.user_id,
      local: this.sms.local,
      status: this.sms.status,
      message: this.sms.message
    }

    this.api.post("sms_notifications/", body, this.token).subscribe(
      async data => {
        //this.getMessages();
        alert("Message Sent.. :) ")
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })

      }
    );
  }

  searchItems() {
    if (this.itemFilter.length >= 3) {
      let field = 'title,code,item_status,owner_code,phone,email';
      let value = this.itemFilter;

      this.filter_config.queries = `${field},like,${value}`;
      this.getWinners();
    }

    if (this.itemFilter == '' || this.itemFilter == null) {
      this.filter_config.queries = null;
      this.getWinners();
    }
  }

  filterDates() {
    if (this.start_date && this.end_date) {
      let field_e = 'end_date';
      let value_e = this.end_date;

      let field_s = 'start_date';
      let value_s = this.start_date;

      this.filter_config.queries = `${field_s},ge,${value_s}`;
      this.filter_config.queries_2 = `${field_e},le,${value_e}`;

      this.getWinners();
    }
    else {
      this.filter_config.queries = null;
      this.getWinners();
    }
  }

  clear() {
    this.filter_config.queries = null;
    this.filter_config.queries_2 = null;
    this.getWinners();
  }
}
