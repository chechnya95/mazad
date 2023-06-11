import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  token: any;

  bids: any[] = [];
  item: any;
  keys: any;
  url: any;

  Swal = require('sweetalert2');
  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = false;
    this.utility.loader = false;
    this.utility.title = 'Item Details';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.item = JSON.parse(localStorage.getItem('item_details'));
    this.bids = JSON.parse(localStorage.getItem('item_bids'));

    if (this.item) {
      this.keys = Object.keys(this.item.details);
      this.url = `${this.api.website}item/${this.item.id}`
    }
  }

  ngAfterViewInit(): void {
    window.print();
  }
}
