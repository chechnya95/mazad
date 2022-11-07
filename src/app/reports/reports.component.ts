import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  token: any;
  auctions: any[] = [];
  auctionList: any[] = [];

  report: any;

  auction_id: any;
  showList: boolean = false;

  Swal = require('sweetalert2')

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Reports';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getAuctions();
  }

  async getAuctions() {
    this.api.get('auctions/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  async getReport(id: any) {
    this.utility.loader = true;
    const sub = this.api.get(`auctions/report/${id}`, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.report = objects['auction_report'];
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

  onChangeAuction(value?: any) {
    let auction = this.auctions.find(i => i.code === value);
    this.auction_id = auction.id;

    this.showList = false
  }

  onChangeOwner(value?: any) {
    let auction: any[] = this.auctions.filter(i => i.owner_code === value);

    this.auctionList = auction;
    if (this.auctionList.length > 1)
      this.showList = true
    else
      this.auction_id = this.auctionList[0].id;
  }
}
