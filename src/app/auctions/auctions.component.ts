import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { MdEditorOption } from 'ngx-markdown-editor';

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
  filter_config: any;

  auction = {
    auction_type: "public",
    auction_method: "increasing",
    code: null,
    owner_code: null,
    details: null,
    images: null,
    deposit: null,
    start_date: null,
    end_date: null,
    auction_status: "Draft",
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

  edit_auction_id: any;
  edit_auction = {
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

  auction_id: any;
  auctionFilter = '';
  owner_name = null;

  isOwner: boolean = false;

  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    usingFontAwesome5: true,
    fontAwesomeVersion: '5',
    resizable: true,
    customRender: {
      image: function (href: string, title: string, text: string) {
        let out = `<img style="max-width: 100%; border: 20px solid red;" src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        //console.log(this);
        // out += (<any>this.options).xhtml ? '/>' : '>';
        return out;
      },
    },
  };
  public mode: string = 'editor';
  public markdownText: any;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Auctions';
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.auction_id = params['id'] != null ? params['id'] : null;

      this.getAuctions();
    })
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
    this.getAuctions(true);
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getAuctions(true);
  }

  async getAuctions(search = false) {
    this.utility.loader = true;
    const sub = this.api.get('auctions/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];
        this.filter_config.totalItems = objects['auctions']['filters']['total_results'];

        if (this.auction_id)
          this.auctions = this.auctions.filter(i => i.id === this.auction_id);
      },
      async error => { }
    );

    sub.add(() => { if (!search) this.getOwners(); else this.utility.loader = false; })
  }

  async getOwners() {
    const sub = this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = { owners: [] }
        objects = data;
        this.owners = objects.owners;

        this.owners.forEach(function (owner) {
          if (owner.title) {
            let title = owner.title;
            owner.contact = title.en ? title.en : title.ar ? title.ar : owner.phone;
          }
          else {
            owner.contact = owner.email ? owner.email : owner.phone;
          }
        });
      },
      async error => { if (error.status == 403) this.isOwner = true; }
    );

    sub.add(() => { this.getAuctionStatus(); })
  }

  async getAuctionStatus() {
    const sub = this.api.get('auctions/auction_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.auction_status = objects.auction_status;
      },
      async error => { }
    );

    sub.add(() => { this.getGroups(); })
  }

  async getGroups() {
    const sub = this.api.get('groups/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.groups = objects['groups'];
      },
      async error => { if (error.status == 403) this.isOwner = true; }
    );

    sub.add(() => { this.utility.loader = false; })
  }

  async getTemplates() {
    this.api.get('auction_templates/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
      },
      async error => { }
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
        this.getAuctions(true);
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  editItemClicked(item: any) {
    this.edit_auction = item;
    this.edit_auction_id = item.id;

    this.edit_auction.title_ar = item.title['ar'];
    this.edit_auction.title_en = item.title['en'];
    this.edit_auction.terms_ar = item.terms['ar'];
    this.edit_auction.terms_en = item.terms['en'];
    this.edit_auction.description_ar = item.description['ar'];
    this.edit_auction.description_en = item.description['en'];

    var date_start = new Date(item.start_date);
    var month_start = (date_start.getMonth() + 1).toString();
    var day_start = (date_start.getDate()).toString();

    if (+month_start < 10)
      month_start = '0' + month_start;

    if (+day_start < 10)
      day_start = '0' + day_start;

    this.edit_auction.start_date = date_start.getFullYear() + '-' + month_start + '-' + day_start;

    var end_date = new Date(item.end_date);
    var month_end = (end_date.getMonth() + 1).toString();
    var day_end = (end_date.getDate()).toString();

    if (+month_end < 10)
      month_end = '0' + month_end;

    if (+day_end < 10)
      day_end = '0' + day_end;

    this.edit_auction.end_date = end_date.getFullYear() + '-' + month_end + '-' + day_end;
    this.owner_name = this.owners.find(i => i.id === item.owner_id)?.title.ar;

    this.edit_auction.group_id = item.group_id;
  }

  OnUpdate(id: any) {
    let body = {
      auction_type: this.edit_auction.auction_type,
      auction_method: this.edit_auction.auction_method,
      code: this.edit_auction.code,
      owner_code: this.edit_auction.owner_code,
      details: this.edit_auction.details,
      images: this.edit_auction.images,
      deposit: this.edit_auction.deposit,
      start_date: this.edit_auction.start_date,
      end_date: this.edit_auction.end_date,
      auction_status: this.edit_auction.auction_status,
      template_id: this.edit_auction.template_id,
      owner_id: this.edit_auction.owner_id,
      payment_id: this.edit_auction.payment_id,
      group_id: this.edit_auction.group_id == '' ? null : this.edit_auction.group_id,
      title: { 'en': this.edit_auction.title_en, 'ar': this.edit_auction.title_ar },
      description: { 'en': this.edit_auction.description_en, 'ar': this.edit_auction.description_en },
      terms: { 'en': this.edit_auction.terms_en, 'ar': this.edit_auction.terms_ar }
    }

    const sub = this.api.update('auctions/' + id, body, this.token).subscribe(
      async data => { },
      async errr => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );

    sub.add(() => { this.getAuctions(true); });
  }

  deleteAuction(id: number) {
    if (confirm("Delete this auction?")) {
      this.api.delete("auctions/" + id, this.token).subscribe(
        async data => {
          this.getAuctions(true);
        },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
  }

  saveAuction(item: any) {
    localStorage.removeItem('auction');
    localStorage.setItem('auction', JSON.stringify(item));
  }

  onChangeOwner(owner_contact: any) {
    if (owner_contact.length >= 3) {
      let field = 'email,phone';
      let value = owner_contact;
      this.filter_config.queries = `${field},like,${value}`;

      const sub = this.api.get('owners/', this.token, { params: this.getHttpParams()}).subscribe(
        async data => {
          let objects: any = {
            owners: []
          }
          objects = data;

          this.owners = objects.owners;
          this.owners.forEach((owner) => {
            owner.contact = owner.email ? owner.email : owner.phone;
          });
        },
        async error => { }
      );

      sub.add(() => { this.filter_config.queries = null; });
    }
  }

  onEditChangeOwner(owner_contact?: any) {
    let owner = this.owners.find(i => i.contact === owner_contact);
    this.edit_auction.owner_id = owner.id;
    this.owner_name = this.owners.find(i => i.id === this.edit_auction.owner_id).title.ar;
  }

  searchAuction() {
    if (this.auctionFilter.length >= 3) {
      let field = 'code,owner_code,details,title,description';
      let value = this.auctionFilter;

      this.filter_config.queries = `${field},like,${value}`;
      this.getAuctions(true);
    }

    if (this.auctionFilter == '' || this.auctionFilter == null) {
      this.filter_config.queries = null;
      this.getAuctions(true);
    }
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
        this.api.get('auctions/export/' + id, this.token, { responseType: 'blob', observe: 'response' }).subscribe((response: any) => {
          const filename = this.getFilenameFromResponse(response, id+'_auction.xlsx');
          const url = window.URL.createObjectURL(response.body);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element from the DOM
          Swal.fire({
            icon: 'success',
            title: 'Downloaded successfully!',
            text: `The file ${filename} has been downloaded.`,
            timer: 3000,
            timerProgressBar: true,
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to download file',
          });
        });
      }
    });
  }

  private getFilenameFromResponse(response, defaultname='file.xlsx'): string {
    //console.log(response);
    console.log(response.headers);
    const contentDispositionHeader = response.headers.get('Content-Disposition');
    //console.log(contentDispositionHeader);
    if (!contentDispositionHeader) {
      return defaultname;
    }
    const matches = contentDispositionHeader.match(/filename\s*=\s*(?<filename>.+)/);
    if (matches && matches.groups) {
      return matches.groups.filename;
    } else {
      return defaultname;
    }
  }

  import(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Select file' : 'اختر ملف',
      html:
        '<input type="file" class="form-control form-control-solid mb-3 mb-lg-0" id="image" accept="xlsx,xls" (change)="imageChange($event)"  />',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        let formData: FormData = new FormData();

        if (this.excel) {
          formData.append('file', this.excel, this.excel.name);
          this.api.post('auctions/import/' + id, null, this.token).subscribe(
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
            });
        }
      }
    });
  }
}
