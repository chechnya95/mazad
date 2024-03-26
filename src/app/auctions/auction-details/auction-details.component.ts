import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2'
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  auction: any;
  token: any;
  items: any[] = [];
  templates: any[] = [];

  filter_config: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;
  approvalModal: boolean = false;
  clicked: boolean = false;
  emptyModal: boolean = false;
  approvalBtn: boolean = false;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private router: Router, private api: ApiService, public translate: TranslateService) {
    this.token = localStorage.getItem('access_token');
    this.utility.show = true;
    this.utility.loader = false;

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

  ngOnInit(): void {
    this.auction = localStorage.getItem('auction') ? JSON.parse(localStorage.getItem('auction')) : null;

    if (this.auction) {
      //this.utility.title = this.translate.currentLang == 'en' ? this.auction?.title.en : this.auction?.title.ar;
      this.getItems();
    }
    else { this.router.navigate(['auctions']); }
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
    this.getItems();
  }

  async getItems() {
    const sub = this.api.get('items/auction/' + this.auction.id, this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items']['items'];
        this.filter_config.totalItems = objects['items']['filters']['total_results'];

        this.items.forEach((item) => {
          item.selected = false;
        })

        if (this.filter_config.totalItems > 100) this.filter_config.pageSizeOptions.push(this.filter_config.totalItems);
      },
      async error => { }
    );

    sub.add(() => { this.getTemplates(); });
  }

  async getTemplates() {
    this.api.get('auction_templates/auction/' + this.auction.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates']['auction_templates'];
      },
      async error => { }
    );
  }

  checkUncheckAll() {
    if (!this.clicked) {
      this.items.forEach(item => {
        if (item.item_status.toLowerCase() == 'approval')
          item.selected = true;
      });
      this.clicked = true;
      this.approvalBtn = true;
    }
    else {
      this.items.forEach(item => {
        if (item.item_status.toLowerCase() == 'approval')
          item.selected = false;
      });
      this.clicked = false;
      this.approvalBtn = false;
    }
  }

  onApproveClicked() {
    let approvalList: any[] = this.items.filter(i => i.selected == true);
    this.approveMultipleItems(approvalList);
  }

  approveItem(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to approve the selected?' : 'الموافقة على السلعة، هل انت متأكد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.get('items/to_status/payment/' + id, this.token).subscribe(
          async data => { this.getItems(); this.successMessage = true; },
          async error => { this.errorMessage = true; }
        );
      }
    });
  }

  approveMultipleItems(list: any[]) {
    let status = false;
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to approve the selected items?' : 'الموافقة على السلع المحددة، هل انت متأكد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        list.forEach((item) => {
          this.api.get('items/to_status/payment/' + item.id, this.token).subscribe(
            async data => { status = true; },
            async error => { status = false; }
          );
        });

        if (list.length == 0)
          this.emptyModal = true;
        else {
          if (status)
            this.successMessage = true;
          else
            this.errorMessage = true;
        }
      }
    });
  }

  excel: any;
  imageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.excel = fileList[0];
  }

  export(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to export Auction?' : 'هل تريد المواصلة لتحميل مزاد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.get('auctions/export/' + id, this.token, { responseType: 'blob' }).subscribe(
          (response: any) => {
            let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let url = window.URL.createObjectURL(blob);
            let pwa = window.open(url);
            if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
              Swal.fire(
                'Warning!',
                'Please disable your Pop-up blocker and try again.'
              );
            }
          },
          err => {
            Swal.fire(
              'Error!',
              'Could not send your request!'
            );
          });
      }
    });
  }

  async import(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    const { value: file } = await Swal.fire({
      title: lang == 'en' ? 'Select file' : 'اختر ملف',
      input: "file",
      inputAttributes: {
        "accept": "xlsx,xls",
        "aria-label": "Upload your excel file here"
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);

        this.api.post('auctions/import/' + id, formData, this.token).subscribe(
          res => {
            Swal.fire({
              title: 'Success',
              text: 'Done!'
            })
          },
          err => {
            Swal.fire(
              'Error!',
              'Could not send your request!'
            );
          }
        );
      };
      reader.readAsDataURL(file);
    }

    // Swal.fire({
    //   title: lang == 'en' ? 'Select file' : 'اختر ملف',
    //   html:
    //     '<input type="file" class="form-control form-control-solid mb-3 mb-lg-0" id="image" accept="xlsx,xls" (change)="imageChange($event)"  />',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
    //   cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     let formData: FormData = new FormData();
    //     if (this.excel) {
    //       formData.append('file', this.excel, this.excel.name);
    //       this.api.post('auctions/import/' + id, null, this.token).subscribe(
    //         res => {
    //           Swal.fire({
    //             title: 'Success',
    //             text: 'Done!'
    //           })
    //         },
    //         err => {
    //           Swal.fire(
    //             'Error!',
    //             'Could not send your request!'
    //           );
    //         });
    //     }
    //   }
    // });
  }
}
