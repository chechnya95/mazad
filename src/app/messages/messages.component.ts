import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import {Sort} from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  token: any;
  messages: any[] = [];

  note: string = '';
  message_id: any;
  filter_config: any;

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Contacts Messages';
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
    this.getMessages();
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
    this.getMessages();
  }
  
  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getMessages();
  }

  getMessages() {
    this.utility.loader = true;
    const sub = this.api.get('contactus/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.messages = objects['contactus'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => {
        
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  on_delete(id: any) {
    if (confirm("Delete this Message?")) {
      this.api.delete("contactus/" + id, this.token).subscribe(
        async data => {
          this.getMessages();
        },
        async error => {
          alert("ERROR: cannot connect!");
          
        }
      );
    }
  }

  on_edit_clicked(id: any) {
    this.message_id = id;
  }

  on_review(id: any) {
    let body = { note: this.note };

    const sub = this.api.update('contactus/' + id, body, this.token).subscribe(
      async data => { },
      async errr => {  }
    );

    sub.add(() => { this.getMessages(); });
  }

  saveMessage(message: any) {
    localStorage.removeItem('message');
    localStorage.setItem('message', JSON.stringify(message));
  }
}
