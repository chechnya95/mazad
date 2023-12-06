import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(private router: Router, private api: ApiService, public utility: UtilitiesService, private route: ActivatedRoute) {
    this.token = localStorage.getItem('access_token');
    this.utility.title = 'Payment Details';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;

      if (id) this.getPayment(id);
      else {
        this.payment = localStorage.getItem('payment') ? JSON.parse(localStorage.getItem('payment')) : null;
        if (this.payment) { }
        else { this.router.navigate(['payment-transactions']); }
      }
    });
  }

  getPayment(id: any) {
    const sub = this.api.get('payments/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payment = objects['payments'][0];
        this.payment.requester.user_details = JSON.parse(this.payment?.requester.user_details);
      },
      async error => { }
    );

    sub.add(() => {
      if (!this.payment) { this.router.navigate(['payment-transactions']); }
    });
  }

  response: any;
  retry(id: any) {
    const sub = this.api.get('payments/check/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.successMessage = true;
        this.response = 'Payment status is ' + objects['payments'];
      },
      async error => { this.errorMessage == true; }
    );

    sub.add(() => { });
  }
}
