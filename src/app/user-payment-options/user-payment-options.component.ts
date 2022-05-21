import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-user-payment-options',
  templateUrl: './user-payment-options.component.html',
  styleUrls: ['./user-payment-options.component.css']
})
export class UserPaymentOptionsComponent implements OnInit {

  token: any;
  paymnet_options: any[] = [];
  options: any[] = [];
  users: any[] = [];
  configs: any[] = [];

  payment_options = {
    option: null,
    user_id: null,
    config_id: null,

    auction_fee: null,
    mazad_auction_fee: null,
    mazad_service_fee: null,
    vat_for_item: null,
    vat_for_mazad: null
  }

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'User Payment Options';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getPaymentOptions();
  }

  getPaymentOptions() {
    this.utility.loader = true;
    const sub = this.api.get('user_payment_options/', this.token).subscribe(
      async data => {
        this.payment_options = data['user_payment_options'];
        console.log(data['user_payment_options']);
      },
      async error => { console.log(error); }
    );

    sub.add(() => { this.utility.loader = false; this.getOptions(); });
  }

  getOptions() {
    const sub = this.api.get('user_payment_options/payment_option', this.token).subscribe(
      async data => {
        let objects: any = { user_payment_options: [] }
        objects = data;
        
        this.options = objects;
      },
      async error => { console.log(error); }
    );

    sub.add(() => { this.getConfigs(); });
  }

  getConfigs() {
    const sub = this.api.get('payments/payment_config', this.token).subscribe(
      async data => {
        let objects: any = { payment_config: [] }
        objects = data;
        this.configs = objects.payment_config;
      },
      async error => { console.log(error); }
    );

    sub.add(() => { this.getUsers(); });
  }

  async getUsers() {
    this.api.get('users/', this.token).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.users.forEach(function (user) {
          user.contact = user.email ? user.email : user.phone;
        });
      },
      async error => {
        alert(error);
      }
    );
  }

  OnSubmit() {
    let body = {
      option: this.payment_options.option,
      user_id: this.payment_options.user_id,
      config_id: this.payment_options.config_id,
      auction_fee: this.payment_options.auction_fee,
      mazad_auction_fee: this.payment_options.mazad_auction_fee,
      mazad_service_fee: this.payment_options.mazad_service_fee,
      vat_for_item: this.payment_options.vat_for_item,
      vat_for_mazad: this.payment_options.vat_for_mazad
    }

    this.api.post("user_payment_options/", body, this.token).subscribe(
      async data => {
        this.getPaymentOptions();
        this.successMessage = true;
      },
      async error => {
        console.log(error);
        this.errorMessage = true;
      }
    );
  }
}
