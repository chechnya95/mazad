import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import {Sort} from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css']
})
export class TemplateDetailsComponent implements OnInit {

  token: any;
  item: any;
  keys: any;
  template_id: any;

  items: any[] = [];

  owner: any;
  category: any;

  start_date: any;
  end_date: any;
  errorMessage: boolean = false;
  successMessage: boolean = false;
  filter_config: any;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Template Details';
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
        this.template_id = id;
        let objects = localStorage.getItem('templates') ? JSON.parse(localStorage.getItem('templates')) : null;
        if (objects) {
          this.item = objects.find(i => i.id === id);
          this.keys = Object.keys(this.item.details);

          this.getTemplateItems(id);
        }
      }
      else { this.router.navigate(['auction_templates']); }
    })
  }

  getTemplateItems(id: any) {
    const sub = this.api.get('items/template/' + id, this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items']['items'];
        this.filter_config.totalItems = objects['items']['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.getOwner(); });
  }

  getOwner() {
    const sub = this.api.get('owners/' + this.item.owner_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        let owners: any[] = objects['owners'];

        if (owners.length > 0)
          this.owner = objects['owners'][0];
      },
      async error => { }
    );

    sub.add(() => { this.getCategory(); });
  }

  getCategory() {
    const sub = this.api.get('categories/' + this.item.category_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.category = objects['categories'][0];
      },
      async error => { }
    );
  }

  saveTemplate(item: any) {
    localStorage.removeItem('item-template');
    localStorage.setItem('item-template', JSON.stringify(item));
  }

  update_dates(id: any) {
    let start_date = new Date(this.start_date)
    let end_date = new Date(this.end_date)
    let body = {
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString()
    }

    this.api.update('auction_templates/changetime/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => {  this.errorMessage = true; }
    );
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
    this.getTemplateItems(this.template_id);
  }
  
  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getTemplateItems(this.template_id);
  }

}
