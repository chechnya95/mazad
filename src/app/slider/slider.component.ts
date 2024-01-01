import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

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

  type = {
    name: null
  }

  image: any;
  edit_image: any;
  Swal = require('sweetalert2')

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
    this.utility.loader = true;
    this.api.get('sliders/slider_types/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.types = objects['types'];
      },
      async error => { }
    );

    this.utility.loader = false;
  }

  getSliderImages() {
    this.api.get('sliders/', this.token, { params: this.getHttpParams() }).subscribe(
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
    let start_date = new Date(this.slider.from_date)
    //let start_date = `${date_s.getFullYear()}-${date_s.getMonth() + 1}-${date_s.getDate()} ${date_s.getHours()}:${date_s.getMinutes()}+0400`;

    let end_date = new Date(this.slider.to_date)
    //let end_date = `${date_e.getFullYear()}-${date_e.getMonth() + 1}-${date_e.getDate()} ${date_e.getHours()}:${date_e.getMinutes()}+0400`;


    const body = JSON.stringify({
      platform: this.slider.platform,
      slider_type: this.slider.slider_type,
      order: this.slider.order,
      from_date: start_date.toISOString(),
      to_date: end_date.toISOString(),
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
          Swal.fire({
            title: 'Error...',
            text: 'ERROR: cannot connect!'
          });
        }
      );
    }
  }

  AddSliderType() {
    const body = { name: this.type.name }

    this.api.post("sliders/slider_types/", body, this.token).subscribe(
      async data => {
        this.getSliderTypes();
        Swal.fire(
          'Success!',
          'Request Sent Successflly!'
        );
      },
      async error => {
        Swal.fire({
          title: 'Error...',
          text: 'ERROR: cannot connect!'
        });
      }
    );
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

    let date_start = new Date(item.from_date);


    this.edit_slider.from_date = this.utility.convertDateForInput(date_start.toString());

    let end_date = new Date(item.to_date);

    this.edit_slider.to_date = this.utility.convertDateForInput(end_date.toString());
  }

  OnUpdate(id: any) {
    let from_date = new Date(this.edit_slider.from_date)
    let to_date = new Date(this.edit_slider.to_date)
    let body = {
      platform: this.edit_slider.platform,
      slider_type: this.edit_slider.slider_type,
      order: this.edit_slider.order,
      from_date: from_date.toISOString(),
      to_date: to_date.toISOString(),
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

  deleteItem(id: any) {
    this.api.delete('sliders/' + id, this.token).subscribe(
      async data => {
        this.getSliderImages();
        Swal.fire(
          'Success!',
          'Request Sent Successflly!'
        );
      },
      async error => {
        Swal.fire({
          title: 'Error...',
          text: 'ERROR: cannot connect!'
        });
      }
    );
  }

  removeType(name: any) {
    this.api.delete('sliders/slider_types/' + name, this.token).subscribe(
      async data => {
        this.getSliderTypes();
        Swal.fire(
          'Success!',
          'Request Sent Successflly!'
        );
      },
      async error => {
        Swal.fire({
          title: 'Error...',
          text: 'ERROR: cannot connect!'
        });
      }
    );
  }
}
