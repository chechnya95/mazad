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

  payment_options = {

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

  }

  OnSubmit() {
    let body = {
      
    }
  }
}
