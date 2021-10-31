import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.css']
})
export class AuctionsComponent implements OnInit {

  token: any;
  auctions: any[] = [];
  groups: any[] = [];
  owners: any[] = [];
  templates: any[] = [];

  auction = {
    auction_type: null,
    auction_method: null,
    code: null,
    owner_code: null,
    details: null,
    images: null,
    deposit: null,
    start_date: null,
    end_date: null,
    auction_status: null,
    template_id: null,
    owner_id: null,
    payement_id: null,
    group_id: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getAuctions();
  }

  async getAuctions() {
    this.api.get('auctions/', this.token).subscribe(
      async data => {
        let objects: any = { auctions: [] }
        objects = data;

        this.auctions = objects.auctions;
        this.getOwners();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getOwners() {

  }

  OnSubmit() {
    let body = {
      auction_type: this.auction.auction_type,
      auction_method: this.auction.auction_method,
      code: this.auction.code,
      owner_code: this.auction.owner_code,
      details: this.auction.details,
      images: this.auction.images,
      deposit: this.auction.deposit,
      start_date: this.auction.start_date,
      end_date: this.auction.end_date,
      auction_status: this.auction.auction_status,
      template_id: this.auction.template_id,
      owner_id: this.auction.owner_id,
      payement_id: this.auction.payement_id,
      group_id: this.auction.group_id
    }

    this.api.post("auctions/", body, this.token).subscribe(
      async data => {
        this.getAuctions();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }
}
