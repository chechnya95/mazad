import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {

  invoice: any;
  token: any;

  constructor(private router: Router, private api: ApiService, public utility: UtilitiesService) {
    this.token = localStorage.getItem('access_token');
    this.utility.title = 'Invoice Details';
  }

  ngOnInit(): void {
    this.invoice = localStorage.getItem('invoice') ? JSON.parse(localStorage.getItem('invoice')) : null;

    if (this.invoice) { this.invoice.user_details.details = this.invoice.user_details.details ? JSON.parse(this.invoice.user_details.details) : ''; }
    else { this.router.navigate(['auctions']); }
  }
}
