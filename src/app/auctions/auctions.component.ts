import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.css']
})
export class AuctionsComponent implements OnInit {

  token: any;
  auctions: any[] = [];
  groups: any[] = [];
  owners: any[] = [];
  templates: any[] = [];
  auction_status: any[] = [];
  filter_config: any;

  auction = {
    auction_type: "public",
    auction_method: "increasing",
    code: null,
    owner_code: null,
    details: null,
    images: null,
    deposit: null,
    start_date: null,
    end_date: null,
    auction_status: "Draft",
    template_id: null,
    owner_id: null,
    payment_id: null,
    group_id: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  edit_auction_id: any;
  edit_auction = {
    auction_type: null,
    auction_method: null,
    code: null,
    owner_code: null,
    details: null,
    images: null,
    deposit: null,
    start_date: null,
    end_date: null,
    auction_status: null,
    template_id: null,
    owner_id: null,
    payment_id: null,
    group_id: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  auction_id: any;
  auctionFilter = '';

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Auctions';
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
      this.auction_id = params['id'] != null ? params['id'] : null;

      this.getAuctions();
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
  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getAuctions();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getAuctions();
  }

  async getAuctions() {
    this.utility.loader = true;
    this.api.get('auctions/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];
        this.filter_config.totalItems = objects['auctions']['filters']['total_results'];

        if (this.auction_id)
          this.auctions = this.auctions.filter(i => i.id === this.auction_id);

        this.getOwners();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  async getOwners() {
    this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = { owners: [] }
        objects = data;
        this.owners = objects.owners;

        this.getAuctionStatus();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  async getAuctionStatus() {
    this.api.get('auctions/auction_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.auction_status = objects.auction_status;

        this.utility.loader = false;
        this.getGroups();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  async getGroups() {
    this.api.get('groups/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.groups = objects['groups'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  async getTemplates() {
    this.api.get('auction_templates/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  OnSubmit() {
    let body = {
      auction_type: this.auction.auction_type,
      auction_method: this.auction.auction_method,
      code: this.auction.code,
      owner_code: this.auction.owner_code,
      details: this.auction.details,
      images: this.auction.images,
      deposit: this.auction.deposit,
      start_date: this.auction.start_date,
      end_date: this.auction.end_date,
      auction_status: this.auction.auction_status,
      template_id: this.auction.template_id,
      owner_id: this.auction.owner_id,
      payment_id: this.auction.payment_id,
      group_id: this.auction.group_id,
      title: { 'en': this.auction.title_en, 'ar': this.auction.title_ar },
      description: { 'en': this.auction.description_en, 'ar': this.auction.description_en },
      terms: { 'en': this.auction.terms_en, 'ar': this.auction.terms_ar }
    }

    this.api.post("auctions/", body, this.token).subscribe(
      async data => {
        this.getAuctions();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  editItemClicked(item: any) {
    this.edit_auction = item;
    this.edit_auction_id = item.id;

    this.edit_auction.title_ar = item.title['ar'];
    this.edit_auction.title_en = item.title['en'];
    this.edit_auction.terms_ar = item.terms['ar'];
    this.edit_auction.terms_en = item.terms['en'];
    this.edit_auction.description_ar = item.description['ar'];
    this.edit_auction.description_en = item.description['en'];

    var date_start = new Date(item.start_date);
    var month_start = (date_start.getMonth() + 1).toString();
    var day_start = (date_start.getDate()).toString();

    if (+month_start < 10)
      month_start = '0' + month_start;

    if (+day_start < 10)
      day_start = '0' + day_start;

    this.edit_auction.start_date = date_start.getFullYear() + '-' + month_start + '-' + day_start;

    var end_date = new Date(item.end_date);
    var month_end = (end_date.getMonth() + 1).toString();
    var day_end = (end_date.getDate()).toString();

    if (+month_end < 10)
      month_end = '0' + month_end;

    if (+day_end < 10)
      day_end = '0' + day_end;

    this.edit_auction.end_date = end_date.getFullYear() + '-' + month_end + '-' + day_end;
  }

  OnUpdate(id: any) {
    let body = {
      auction_type: this.edit_auction.auction_type,
      auction_method: this.edit_auction.auction_method,
      code: this.edit_auction.code,
      owner_code: this.edit_auction.owner_code,
      details: this.edit_auction.details,
      images: this.edit_auction.images,
      deposit: this.edit_auction.deposit,
      start_date: this.edit_auction.start_date,
      end_date: this.edit_auction.end_date,
      auction_status: this.edit_auction.auction_status,
      template_id: this.edit_auction.template_id,
      owner_id: this.edit_auction.owner_id,
      payment_id: this.edit_auction.payment_id,
      group_id: this.edit_auction.group_id,
      title: { 'en': this.edit_auction.title_en, 'ar': this.edit_auction.title_ar },
      description: { 'en': this.edit_auction.description_en, 'ar': this.edit_auction.description_en },
      terms: { 'en': this.edit_auction.terms_en, 'ar': this.edit_auction.terms_ar }
    }

    const sub = this.api.update('auctions/' + id, body, this.token).subscribe(
      async data => { },
      async errr => { console.log(errr); }
    );

    sub.add(() => { this.getAuctions(); });
  }

  deleteAuction(id: number) {
    if (confirm("Delete this auction?")) {
      this.api.delete("auctions/" + id, this.token).subscribe(
        async data => {
          this.getAuctions();
        },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
          console.log(error);
        }
      );
    }
  }

  saveAuction(item: any) {
    localStorage.removeItem('auction');
    localStorage.setItem('auction', JSON.stringify(item));
  }
}
