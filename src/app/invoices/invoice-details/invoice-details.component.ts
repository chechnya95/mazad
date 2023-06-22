import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private router: Router, private api: ApiService, public utility: UtilitiesService, private route: ActivatedRoute) {
    this.token = localStorage.getItem('access_token');
    this.utility.title = 'Invoice Details';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;

      if (id) this.getInvoice(id);
      else {
        this.invoice = localStorage.getItem('invoice') ? JSON.parse(localStorage.getItem('invoice')) : null;

        if (this.invoice) { this.invoice.user_details.details = this.invoice.user_details.details ? JSON.parse(this.invoice.user_details.details) : ''; }
        else { this.router.navigate(['invoices']); }
      }
    });
  }

  getInvoice(id: any) {
    this.utility.loader = true;
    const sub = this.api.get('invoices/transaction/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoice = objects['invoices'];
        this.invoice.user_details.details = this.invoice.user_details.details ? JSON.parse(this.invoice.user_details.details) : '';
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  printInv() {
    localStorage.setItem('invoice', JSON.stringify(this.invoice));
  }
}
