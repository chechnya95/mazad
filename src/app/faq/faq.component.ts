import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  token: any;
  topics: any[] = [];
  contents: any[] = [];

  filter_config: any;

  topic = {
    title_en: null,
    title_ar: null
  }
  
  faq = {
    content_en: null,
    content_ar: null
  }

  edit_topic = {
    title_en: null,
    title_ar: null
  }

  edit_topic_id: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  Swal = require('sweetalert2')

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
        //console.log(out);
        // out += (<any>this.options).xhtml ? '/>' : '>';
        return out;
      },
    },
  };
  public mode: string = 'editor';
  public markdownText: any;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'FAQ';
    this.token = localStorage.getItem('access_token');
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getTopics(id);
      }
      else { this.getTopics(); }
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
    return params;
  }
  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getTopics();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getTopics();
  }

  getTopics(id?: any) {
    this.utility.loader = true;
    const sub = this.api.get('faqs/topic/', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.topics = objects['faq_topics'];
        this.filter_config.totalItems = objects['filters']['total_results'];

        if (id)
          this.topics = this.topics.filter(i => i.id === id);
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  async getContent(id: any) {
    const sub = this.api.get('faqs/topics/' + id, this.token).subscribe(
      async data => {
        let objects: any = {
          faqs: []
        }
        objects = data;
        this.contents = objects.faqs;
      },
      async error => { }
    );

    sub.add(() => { });
  }

  OnSubmit() {
    let body = {
      title: { 'en': this.topic.title_en, 'ar': this.topic.title_ar }
    }

    this.api.post('faqs/topic/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getTopics();
      },
      async error => { this.errorMessage = true; }
    );
  }

  editTopicClicked(topic: any) {
    this.edit_topic = topic;
    this.edit_topic_id = topic.id;

    this.edit_topic.title_ar = topic.title.ar;
    this.edit_topic.title_en = topic.title.en;
  }

  OnUpdate(id: any) {
    let body = {
      title: { 'en': this.edit_topic.title_en, 'ar': this.edit_topic.title_ar }
    }

    const sub = this.api.update('faqs/topic/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );

    sub.add(() => { this.getTopics(); });
  }

  addContentToTopic(topic_id: any) {
    let body = {
      faq_topic_id: topic_id,
      content: { 'en': this.faq.content_en, 'ar': this.faq.content_ar }
    }

    this.api.post('faqs/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
  }

  removeTopic(id) {
    this.api.delete('faqs/topic' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getTopics();
      },
      async error => { this.errorMessage = true; }
    );
  }
}
