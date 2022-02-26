import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  token: any;
  invoices: any[] = [];

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Invoices Page';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices() {
    this.utility.loader = true;
    const sub = this.api.get('invoices/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoices = objects['invoices']['invoices'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

}
