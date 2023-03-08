import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  token: any;
  invoices: any[] = [];
  filter_config: any;

  Swal = require('sweetalert2')

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Invoices Page';
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
    this.getInvoices();
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
    this.getInvoices();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getInvoices();
  }

  getInvoices() {
    this.utility.loader = true;
    const sub = this.api.get('invoices/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoices = objects['invoices']['invoices'];
        this.filter_config.totalItems = objects['invoices']['filters']['total_results'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  saveInvoice(invoice: any) {
    localStorage.removeItem('invoice');
    localStorage.setItem('invoice', JSON.stringify(invoice));
  }
}
