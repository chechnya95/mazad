import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
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
  faqs: any[] = [];

  filter_config: any;

  topic = {
    title_en: null,
    title_ar: null
  }
  
  faq = {
    faq_topic_id: '0',
    question_en: null,
    question_ar: null,
    content_en: null,
    content_ar: null
  
  }
  edit_faq = {
    faq_topic_id: '0',
    question_en: null,
    question_ar: null,
    content_en: null,
    content_ar: null
  }

  edit_topic = {
    title_en: null,
    title_ar: null
  }

  edit_topic_id: any;
  edit_faq_id: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  Swal = require('sweetalert2')

  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    usingFontAwesome5: true,
    fontAwesomeVersion: '5',
    resizable: true,
    hideIcons: ['Image'],
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
      pageSizeOptions: [5, 10, 25, 10]
    };
  }

  ngOnInit(): void {
    this.getTopics();
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
    this.getContent();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getContent();
  }

  getTopics() {
    this.utility.loader = true;
    const sub = this.api.get('faqs/topic/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.topics = objects['faq_topics'];
        //this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.getContent(); });
  }

  async getContent() {
    const sub = this.api.get('faqs/', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects: any = {
          faqs: []
        }
        objects = data;
        this.faqs = objects.faqs;
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; });
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

  editFaqClicked(faq: any) {
    this.edit_faq = faq;
    this.edit_faq_id = faq.id;

    this.edit_faq.question_ar = faq.question.ar;
    this.edit_faq.question_en = faq.question.en;
    this.edit_faq.content_ar = faq.content.ar;
    this.edit_faq.content_en = faq.content.en;
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

  addContentToTopic() {
    let body = {
      faq_topic_id: this.faq.faq_topic_id,
      question: { 'en': this.faq.question_en, 'ar': this.faq.question_ar },
      content: { 'en': this.faq.content_en, 'ar': this.faq.content_ar }
    }

    this.api.post('faqs/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getTopics();
      },
      async error => { this.errorMessage = true; }
    );
  }

  removeTopic(id) {
    this.api.delete('faqs/topic/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getTopics();
      },
      async error => { this.errorMessage = true; }
    );
  }
  
  removeFaq(id: any) {
    this.api.delete('faqs/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getContent();
      },
      async error => { this.errorMessage = true; }
    );
  }

  UpdateFAQ(id: any) {
    let body = {
      faq_topic_id: this.edit_faq.faq_topic_id,
      question: { 'en': this.edit_faq.question_en, 'ar': this.edit_faq.question_ar },
      content: { 'en': this.edit_faq.content_en, 'ar': this.edit_faq.content_ar }
    }

    const sub = this.api.update('faqs/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );

    sub.add(() => { this.getTopics(); });
  }
}
