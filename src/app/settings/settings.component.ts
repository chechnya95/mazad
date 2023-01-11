import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  token: any;
  category: string = 'company';

  paymet_types: any[] = [];
  online_statuses: any[] = [];
  gateways: any[] = [];

  payment_config = {
    name: null,
    payment_gateway: null,
    fee: null,
    fee_cap: null,
    limit: null,
    is_default: false,
    online_status: null,
    url: null,
    access_key: null,
    secret_key: null,
    merchant_key1: null,
    merchant_key2: null,
    merchant_key3: null,
    merchant_key4: null,
    merchant_key5: null
  }

  update: boolean = false;
  update_payment_type: boolean = false;
  update_payment_id: any = null;

  company = {
    duraction: null,
    name: null,
    contact: null,
    site: null,
    country: 'OM',
    language: 'ar',
    zone: 'Muscat',
    currency: 'OMR',
  }

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Admin Settings';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.get_settings();
  }

  get_settings() {
    const sub = this.api.get('settings/category/' + this.category, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        let setting = objects['settings'];

        if (setting) { this.company = setting; this.update = true; }
        else { this.update = false; }
      },
      async error => { }
    );

    sub.add(() => { this.getPaymentConfigs(); })
  }

  getGateways() {
    const sub = this.api.get('payments/payment_gateway', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.gateways = objects['gateways'];
      },
      async error => { }
    );

    sub.add(() => { this.getOnlineStatus(); });
  }

  getPaymentConfigs() {
    const sub = this.api.get('payments/payment_config', this.token).subscribe(
      async data => {
        let objects: any = { payment_config: [] }
        objects = data;
        this.paymet_types = objects.payment_config;

        for (let i = 0; i < this.paymet_types.length; i++) {
          this.paymet_types[i].key = this.paymet_types[i].access_key.substr(this.paymet_types[i].access_key.length - 7);
        }
      },
      async error => { }
    );

    sub.add(() => { this.getGateways(); });
  }

  getOnlineStatus() {
    const sub = this.api.get('payments/online_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.online_statuses = objects['online_status'];
      },
      async error => { }
    );
  }

  deletePayment(id: any) {
    if (confirm("Delete this payment cofiguration?")) {
      this.api.delete("payments/payment_config/" + id, this.token).subscribe(
        async data => {
          this.getPaymentConfigs();
        },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
  }

  addPaymentConfig() {
    let body = {
      name: this.payment_config.name,
      online_status: this.payment_config.online_status,
      payment_gateway: this.payment_config.payment_gateway,
      fee: this.payment_config.fee,
      fee_cap: this.payment_config.fee_cap,
      limit: this.payment_config.limit,
      is_default: this.payment_config.is_default,
      url: this.payment_config.url,
      access_key: this.payment_config.access_key,
      secret_key: this.payment_config.secret_key,
      merchant_key1: this.payment_config.merchant_key1,
      merchant_key2: this.payment_config.merchant_key2,
      merchant_key3: this.payment_config.merchant_key3,
      merchant_key4: this.payment_config.merchant_key4,
      merchant_key5: this.payment_config.merchant_key5,
    }

    if (!this.update_payment_type) {
      this.api.post("payments/payment_config", body, this.token).subscribe(
        async data => { this.getPaymentConfigs(); },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
    else {
      this.api.update("payments/payment_config/" + this.update_payment_id, body, this.token).subscribe(
        async data => { this.getPaymentConfigs(); },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
  }

  editPayment(id: any) {
    this.payment_config = this.paymet_types.find(i => i.id === id);
    this.update_payment_type = true;
    this.update_payment_id = id;
  }

  save_settings() {
    let items: any[] = [];

    items.push({ 'key': 'duraction', 'value': this.company.duraction });
    items.push({ 'key': 'name', 'value': this.company.name });
    items.push({ 'key': 'contact', 'value': this.company.contact });
    items.push({ 'key': 'site', 'value': this.company.site });
    items.push({ 'key': 'country', 'value': this.company.country });
    items.push({ 'key': 'language', 'value': this.company.language });
    items.push({ 'key': 'zone', 'value': this.company.zone });
    items.push({ 'key': 'currency', 'value': this.company.currency });

    let body = {
      category: this.category,
      items: items
    }

    if (this.update) {
      this.api.update("settings/" + this.category, body, this.token).subscribe(
        async data => { },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
    else {
      this.api.post("settings/", body, this.token).subscribe(
        async data => { },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
  }
}
