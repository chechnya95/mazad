import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: any;
  categories: any[] = [];
  statuses: any[] = [];
  categories_total_items = 0;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.title = 'Dashboard';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      window.location.reload();
    }

    this.getCategories();
  }

  getCategories() {
    this.utility.loader = true;

    const sub = this.api.get('dashboards/items/category', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.categories = objects['items_statistics'];

        this.categories.forEach((item) => {
          this.categories_total_items += +item.count;
        })
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { this.getStatus(); });
  }

  getStatus() {
    const sub = this.api.get('dashboards/items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.statuses = objects['items_statistics'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
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
