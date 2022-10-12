import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css']
})
export class TemplateDetailsComponent implements OnInit {

  token: any;
  item: any;
  keys: any;

  items: any[] = [];

  owner: any;
  category: any;

  start_date: any;
  end_date: any;
  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Template Details';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        let objects = localStorage.getItem('templates') ? JSON.parse(localStorage.getItem('templates')) : null;
        if (objects) {
          this.item = objects.find(i => i.id === id);
          this.keys = Object.keys(this.item.details);

          this.getTemplateItems(id);
        }
      }
      else { this.router.navigate(['auction_templates']); }
    })
  }

  getTemplateItems(id: any) {
    const sub = this.api.get('items/template/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items']['items'];
      },
      async error => {
        console.log(error);
      }
    );

    sub.add(() => { this.getOwner(); });
  }

  getOwner() {
    const sub = this.api.get('owners/' + this.item.owner_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        let owners: any[] = objects['owners'];

        if (owners.length > 0)
          this.owner = objects['owners'][0];
      },
      async error => {
        console.log(error);
      }
    );

    sub.add(() => { this.getCategory(); });
  }

  getCategory() {
    const sub = this.api.get('categories/' + this.item.category_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.category = objects['categories'][0];
      },
      async error => {
        console.log(error);
      }
    );
  }

  saveTemplate(item: any) {
    localStorage.removeItem('item-template');
    localStorage.setItem('item-template', JSON.stringify(item));
  }

  update_dates(id: any) {
    let body = {
      start_date: this.start_date,
      end_date: this.end_date
    }

    this.api.update('auction_templates/changetime/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }
}
