import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  payment: any;
  token: any;

  constructor(private router: Router, private api: ApiService, public utility: UtilitiesService) {
    this.token = localStorage.getItem('access_token');
    this.utility.title = 'Payment Details';
  }

  ngOnInit(): void {
    this.payment = localStorage.getItem('payment') ? JSON.parse(localStorage.getItem('payment')) : null;

    if (this.payment) {  }
    else { this.router.navigate(['auctions']); }
  }
}
