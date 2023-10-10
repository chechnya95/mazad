import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-owner-payment-options',
  templateUrl: './owner-payment-options.component.html',
  styleUrls: ['./owner-payment-options.component.css']
})
export class OwnerPaymentOptionsComponent implements OnInit {

  token: any;
  paymnet_options: any[] = [];
  options: any[] = [];
  owners: any[] = [];
  configs: any[] = [];
  filter_config: any;

  payment_options = {
    option: null,
    owner_id: null,
    config_id: null,

    auction_fee: null,
    mazad_auction_fee: null,
    mazad_service_fee: null,
    vat_for_item: null,
    vat_for_mazad: null
  }

  edit_payment_options = {
    owner_name: null,
    option: null,
    owner_id: null,
    config_id: null,

    auction_fee: null,
    mazad_auction_fee: null,
    mazad_service_fee: null,
    vat_for_item: null,
    vat_for_mazad: null
  }

  edit_option_id: any;
  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Owner Payment Options';
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
    this.getPaymentOptions();
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
    this.getPaymentOptions();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getPaymentOptions();
  }

  getPaymentOptions() {
    this.utility.loader = true;
    const sub = this.api.get('owner_payment_options/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        this.payment_options = data['owner_payment_options'];
        this.filter_config.totalItems = data['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; this.getOptions(); });
  }

  getOptions() {
    const sub = this.api.get('owner_payment_options/payment_option', this.token).subscribe(
      async data => {
        let objects: any = { owner_payment_options: [] }
        objects = data;

        this.options = objects;
      },
      async error => { }
    );

    sub.add(() => { this.getConfigs(); });
  }

  getConfigs() {
    const sub = this.api.get('payments/payment_config', this.token).subscribe(
      async data => {
        let objects: any = { payment_config: [] }
        objects = data;
        this.configs = objects.payment_config;
        //this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.getOwners(); });
  }

  async getOwners() {
    this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = {
          owners: []
        }
        objects = data;

        this.owners = objects.owners;
        this.owners.forEach(function (owner) {
          if (owner.title) {
            let title = owner.title;
            owner.contact = title.en ? title.en : title.ar ? title.ar : owner.phone;
          }
          else {
            owner.contact = owner.email ? owner.email : owner.phone;
          }
        });
      },
      async error => { }
    );
  }

  OnSubmit() {
    let body = {
      option: this.payment_options.option,
      owner_id: this.payment_options.owner_id,
      config_id: this.payment_options.config_id,
      auction_fee: this.payment_options.auction_fee,
      mazad_auction_fee: this.payment_options.mazad_auction_fee,
      mazad_service_fee: this.payment_options.mazad_service_fee,
      vat_for_item: this.payment_options.vat_for_item,
      vat_for_mazad: this.payment_options.vat_for_mazad
    }

    this.api.post("owner_payment_options/", body, this.token).subscribe(
      async data => {
        this.getPaymentOptions();
        this.successMessage = true;
      },
      async error => {

        this.errorMessage = true;
      }
    );
  }

  editOptionClicked(option: any) {
    this.edit_payment_options = option;
    this.edit_option_id = option.id;

    this.edit_payment_options.option = option.option.toString().toUpperCase();
    this.edit_payment_options.owner_name = option.owner?.title?.en;
    this.edit_payment_options.owner_id = option.owner.id;
  }

  OnUpdate(id: any) {
    let body = {
      option: this.edit_payment_options.option,
      owner_id: this.edit_payment_options.owner_id,
      config_id: this.edit_payment_options.config_id,
      auction_fee: this.edit_payment_options.auction_fee,
      mazad_auction_fee: this.edit_payment_options.mazad_auction_fee,
      mazad_service_fee: this.edit_payment_options.mazad_service_fee,
      vat_for_item: this.edit_payment_options.vat_for_item,
      vat_for_mazad: this.edit_payment_options.vat_for_mazad
    }

    const sub = this.api.update('owner_payment_options/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );

    sub.add(() => { this.getPaymentOptions(); });
  }

  onChangeOwner(owner_contact?: any) {
    let owner = this.owners.find(i => i.contact === owner_contact);
    this.payment_options.owner_id = owner.id;
    this.edit_payment_options.owner_id = owner.id;
    this.edit_payment_options.owner_name = owner?.contact;
  }
}
