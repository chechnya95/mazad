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
  auction_status: any[] = [];

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
    payment_id: null,
    group_id: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Auctions';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getAuctions();
  }

  async getAuctions() {
    this.utility.loader = true;
    this.api.get('auctions/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];
        this.getOwners();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getOwners() {
    this.api.get('users/role/Owner', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.owners = objects['users'];

        this.getAuctionStatus();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getAuctionStatus() {
    this.api.get('auctions/auction_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.auction_status = objects.auction_status;

        this.utility.loader = false;
        //this.getTemplates();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getTemplates() {
    this.api.get('auction_templates/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
      },
      async error => {
        alert(error);
      }
    );
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
      payment_id: this.auction.payment_id,
      group_id: this.auction.group_id,
      title: { 'en': this.auction.title_en, 'ar': this.auction.title_ar },
      description: { 'en': this.auction.description_en, 'ar': this.auction.description_en },
      terms: { 'en': this.auction.terms_en, 'ar': this.auction.terms_ar }
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

  deleteAuction(id: number) {
    if (confirm("Delete this auction?")) {
      this.api.delete("auctions/" + id, this.token).subscribe(
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
}
