import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: any;

  role: any;
  categories: any[] = [];
  statuses: any[] = [];
  total_items = 0;
  total_users = 0;
  total_owners = 0;
  total_income = 0;
  total_insurance: any;
  categories_total_items = 0;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.title = 'Dashboard';
    this.token = localStorage.getItem('access_token');
    this.role = localStorage.getItem('type');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      window.location.reload();
    }

    this.getTotalNoItems();
  }

  getTotalNoItems() {
    this.utility.loader = true;

    const sub = this.api.get('dashboards/items/total', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.total_items = objects['item_count'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        
      }
    );

    sub.add(() => { this.getTotalUsers(); });
  }

  getTotalUsers() {
    const sub = this.api.get('dashboards/users', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.total_users = objects['user_statistics']['total'];
      },
      async error => { }
    );

    sub.add(() => { this.getTotalOwners(); });
  }

  getTotalOwners() {
    const sub = this.api.get('dashboards/owners', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.total_owners = objects['owners_statistics']['total_owner'];
      },
      async error => { }
    );

    sub.add(() => { this.getTotalIncome(); });
  }

  getTotalIncome() {
    const sub = this.api.get('dashboards/invoices/total', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.total_income = objects['invoices_count'];
      },
      async error => { }
    );

    sub.add(() => { this.getTotalInsurance(); });
  }

  getTotalInsurance() {
    const sub = this.api.get('dashboards/wallets', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.total_insurance = objects['wallets_statistics'];
      },
      async error => { }
    );

    sub.add(() => { this.getCategories(); });
  }

  getCategories() {
    const sub = this.api.get('dashboards/items/category', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.categories = objects['items_statistics'];

        this.categories.forEach((item) => {
          this.categories_total_items += +item.count;
        })
      },
      async error => { }
    );

    sub.add(() => { this.getStatus(); });
  }

  getStatus() {
    const sub = this.api.get('dashboards/items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.statuses = objects['items_statistics'];
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  getClassColor(i: number) {
    if (i % 4 == 0)
      return 'text-warning';

    if (i % 4 == 1)
      return 'text-success'

    if (i % 4 == 2)
      return 'text-danger'

    if (i % 4 == 3)
      return 'text-primary'
  }

  getStatusClassColor(i: number) {
    if (i % 4 == 0)
      return 'bg-light-warning';

    if (i % 4 == 1)
      return 'bg-light-success'

    if (i % 4 == 2)
      return 'bg-light-danger'

    if (i % 4 == 3)
      return 'bg-light-primary'
  }

  getIconClassColor(i: number) {
    if (i % 4 == 0)
      return 'svg-icon-warning';

    if (i % 4 == 1)
      return 'svg-icon-success'

    if (i % 4 == 2)
      return 'svg-icon-danger'

    if (i % 4 == 3)
      return 'svg-icon-primary'
  }
}
