import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import {Sort} from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  token: any;
  wallets: any[] = [];
  filter_config: any;

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
      sort_order: 'asc'
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
  pageChangeEvent(event: any) {
    this.filter_config.currentPage = event;
    this.getWallets();
  }
  
  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getWallets();
  }

  getWallets() {
    this.utility.loader = true;
    const sub = this.api.get('wallets/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.wallets = objects['wallets'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

}
