import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import {Sort} from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-auction-templates',
  templateUrl: './auction-templates.component.html',
  styleUrls: ['./auction-templates.component.css']
})
export class AuctionTemplatesComponent implements OnInit {

  token: any;
  templates: any[] = [];
  filter_config: any;

  itemFilter = '';
  
  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.title = 'Auction Templates';
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
    this.getTemplates();
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

  async getTemplates() {
    this.api.get('auction_templates/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
        this.filter_config.totalItems = objects['filters']['total_results'];

        localStorage.setItem('templates', JSON.stringify(this.templates));
      },
      async error => {
        alert(error);
      }
    );
  }

  deleteTemplate(id: any) {
    if (confirm("Delete this template?")) {
      this.api.delete("auction_templates/" + id, this.token).subscribe(
        async data => {
          this.getTemplates();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  saveTemplate(item: any) {
    localStorage.removeItem('item-template');
    localStorage.setItem('item-template', JSON.stringify(item));
  }

  pageChangeEvent(event: any) {
    this.filter_config.currentPage = event;
    this.getTemplates();
  }
  
  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getTemplates();
  }
}
