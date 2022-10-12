import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css']
})
export class BidsComponent implements OnInit {

  token: any;
  bids: any[] = [];
  filter_config: any;

  bidFilter = '';

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(private api: ApiService,
    public utility: UtilitiesService,
    private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Items Biddings';
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
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getBids(id);
      }
      else { this.getBids(null); }
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
  pageChangeEvent(event: any) {
    this.filter_config.currentPage = event;
    this.getBids(null);
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getBids(null);
  }

  getBids(id: any) {
    this.utility.loader = true;
    const sub = this.api.get('bids/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.bids = objects['bids'];
        this.filter_config.totalItems = objects['filters']['total_results'];

        if (id)
          this.bids = this.bids.filter(i => i.item_id === id);
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  disableBid(id: any) {
    this.api.update('bids/disable/' + id, this.token, {}).subscribe(
      async data => { this.successMessage = true; },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }
}
