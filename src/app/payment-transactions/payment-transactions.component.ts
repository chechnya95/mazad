import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-payment-transactions',
  templateUrl: './payment-transactions.component.html',
  styleUrls: ['./payment-transactions.component.css']
})
export class PaymentTransactionsComponent implements OnInit {

  token: any;
  transactions: any[] = [];
  filter_config: any;

  transFilter = '';

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Payment Transactions Page';
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
    this.getPayments();
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
    this.getPayments();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getPayments();
  }

  getPayments() {
    this.utility.loader = true;
    const sub = this.api.get('payments/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.transactions = objects['payments'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  savePayment(payment: any) {
    localStorage.removeItem('payment');
    localStorage.setItem('payment', JSON.stringify(payment));
  }
}
