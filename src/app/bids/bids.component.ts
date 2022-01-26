import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css']
})
export class BidsComponent implements OnInit {

  token: any;
  bids: any[] = [];

  constructor(private api: ApiService,
    public utility: UtilitiesService,
    private route: ActivatedRoute,) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Items Biddings';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getBids(id);
      }
      else { this.getBids(null); }
    })
  }

  getBids(id: any) {
    this.utility.loader = true;
    const sub = this.api.get('bids/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.bids = objects['bids'];

        if (id)
          this.bids = this.bids.filter(i => i.item_id === id);
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }
}
