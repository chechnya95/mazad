import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  types: any[] = [];
  sliders: any[] = [];
  token: any;
  filter_config: any;

  slider = {
    platform: null,
    slider_type: null,
    order: null,
    from_date: null,
    to_date: null,
    title_en: null,
    title_ar: null,
    content_en: null,
    content_ar: null,
    enable: 'true',
    url: null
  }

  edit_slider_image: any;
  edit_slider_id: any;
  edit_slider = {
    platform: null,
    slider_type: null,
    order: null,
    from_date: null,
    to_date: null,
    title_en: null,
    title_ar: null,
    content_en: null,
    content_ar: null,
    enable: 'true',
    url: null
  }

  image: any;
  edit_image: any;

  constructor(public utility: UtilitiesService, public api: ApiService) {
    this.utility.show = true;
    this.utility.title = 'Silder';
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
    this.getSliderImages();
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
    this.getSliderImages();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getSliderImages();
  }

  getSliderTypes() {
    this.api.get('sliders/slider_types/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.types = objects['types'];
      },
      async error => { }
    );
  }

  getSliderImages() {
    this.api.get('sliders/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.sliders = objects['sliders'];
        this.filter_config.totalItems = objects['filters']['total_results'];

        this.getSliderTypes();
      },
      async error => { }
    );
  }

  async OnSubmit() {
    const body = JSON.stringify({
      platform: this.slider.platform,
      slider_type: this.slider.slider_type,
      order: this.slider.order,
      from_date: this.slider.from_date,
      to_date: this.slider.to_date,
      title: { 'en': this.slider.title_en, 'ar': this.slider.title_ar },
      content: { 'en': this.slider.content_en, 'ar': this.slider.content_ar },
      enable: true,
      url: this.slider.url
    });

    let formData: FormData = new FormData();

    if (this.image) {
      formData.append('image', this.image, this.image.name);
      formData.append('form', body);

      this.api.post_form("sliders/", formData, this.token).subscribe(
        async data => {
          this.getSliderImages();
        },
        async error => {
          console.log("POST medias: " + error);
        }
      );
    }
  }

  imageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.image = fileList[0];
  }

  editImageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.edit_image = fileList[0];
  }

  editItemClicked(item: any) {
    this.edit_slider = item;
    this.edit_slider_id = item.id;

    this.edit_slider.title_ar = item.title['ar'];
    this.edit_slider.title_en = item.title['en'];
    this.edit_slider.content_ar = item.content['ar'];
    this.edit_slider.content_en = item.content['en'];

    this.edit_slider.platform = item.platform.toUpperCase();
    this.edit_slider_image = item.image.file;

    var date_start = new Date(item.from_date);
    var month_start = (date_start.getMonth() + 1).toString();
    var day_start = (date_start.getDate()).toString();
    var hour_start = (date_start.getHours()).toString();
    var mins_start = (date_start.getMinutes()).toString();

    if (+month_start < 10)
      month_start = '0' + month_start;

    if (+day_start < 10)
      day_start = '0' + day_start;

    if (+hour_start < 10)
      hour_start = '0' + hour_start;

    if (+mins_start < 10)
      mins_start = '0' + mins_start;

    this.edit_slider.from_date = date_start.getFullYear() + '-' + month_start + '-' + day_start + 'T' + hour_start + ':' + mins_start;

    var end_date = new Date(item.to_date);
    var month_end = (end_date.getMonth() + 1).toString();
    var day_end = (end_date.getDate()).toString();
    var hour_end = (end_date.getHours()).toString();
    var mins_end = (end_date.getMinutes()).toString();

    if (+month_end < 10)
      month_end = '0' + month_end;

    if (+day_end < 10)
      day_end = '0' + day_end;
    if (+hour_end < 10)
      hour_end = '0' + hour_end;

    if (+mins_end < 10)
      mins_end = '0' + mins_end;

    this.edit_slider.to_date = end_date.getFullYear() + '-' + month_end + '-' + day_end + 'T' + hour_end + ':' + mins_end;
  }

  OnUpdate(id: any) {
    let body = {
      platform: this.edit_slider.platform,
      slider_type: this.edit_slider.slider_type,
      order: this.edit_slider.order,
      from_date: this.edit_slider.from_date,
      to_date: this.edit_slider.to_date,
      title: { 'en': this.edit_slider.title_en, 'ar': this.edit_slider.title_ar },
      content: { 'en': this.edit_slider.content_en, 'ar': this.edit_slider.content_ar },
      enable: true,
      url: this.edit_slider.url
    }

    let sub = null;

    let formData: FormData = new FormData();
    if (this.edit_image) {
      formData.append('image', this.edit_image, this.edit_image.name);
      formData.append('form', JSON.stringify(body));

      sub = this.api.update_form('sliders/' + id, formData, this.token).subscribe(
        async data => { },
        async errr => { }
      );
    }
    else {
      sub = this.api.update('sliders/' + id, body, this.token).subscribe(
        async data => { },
        async errr => { }
      );
    }

    sub.add(() => { this.getSliderImages(); });
  }
}
