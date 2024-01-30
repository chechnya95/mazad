import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  token: any;
  auctions: any[] = [];
  auctionList: any[] = [];
  filter_config: any;

  report: any;
  format: any;

  auction_id: any;
  showList: boolean = false;

  Swal = require('sweetalert2')

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Reports';
    this.token = localStorage.getItem('access_token');
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      queries: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };
  }

  ngOnInit(): void { }

  async getAuctions() {
    this.api.get('auctions/', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];
      },
      async error => { }
    );
  }

  async getReport(id: any) {
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      queries: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };

    this.utility.loader = true;
    const sub = this.api.get(`auctions/report/${id}`, this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.report = objects['auction_report'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        });
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  getDetails(details: any) {
    return UtilitiesService.parseIfNotJsonObject(details);
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

  exportexcel(fileName: string, sheet: string): void {
    if (this.format) {
      if (this.format === 'excel') {
        let element = document.getElementById('kt_table_report');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheet);

        /* save to file */
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      }
      if (this.format === 'pdf') {
        // toDO ... export to pdf option 
        //window.print();
        Swal.fire({
          title: 'Coming Soon.'
        });
      }
    }
    else {
      Swal.fire({
        title: 'Hey...',
        text: 'Please select export format!'
      });
    }
  }

  getHttpParams() {
    let params = new HttpParams();
    params = params.append('page', this.filter_config.currentPage.toString());
    params = params.append('per_page', this.filter_config.itemsPerPage.toString());
    if (this.filter_config.sort) {
      params = params.append('sort', this.filter_config.sort);
      params = params.append('sort_order', this.filter_config.sort_order);
    }
    if (this.filter_config.queries) {
      params = params.append('queries', this.filter_config.queries);
    }
    return params;
  }

  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getReport(this.auction_id); //TODO: need to change
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getReport(this.auction_id); //TODO: need to change
  }

  auction_search: any;
  onChangeAuctionName() {
    console.log(this.auction_search)
    if (this.auction_search.length >= 3) {
      let field = 'code,owner_code,title';
      let value = this.auction_search;

      this.filter_config.queries = `${field},like,${value}`;
      this.getAuctions();
    }

    if (this.auction_search == '' || this.auction_search == null) {
      this.filter_config.queries = null;
      this.getAuctions();
    }
  }
}
