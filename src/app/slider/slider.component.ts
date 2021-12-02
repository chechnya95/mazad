import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  types: any[] = [];
  sliders: any[] = [];
  token: any;

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

  image: any;

  constructor(public utility: UtilitiesService, public api: ApiService) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getSliderImages();
  }

  getSliderTypes() {
    this.api.get('sliders/slider_types/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.types = objects['types'];
      },
      async error => {
        alert(error);
      }
    );
  }

  getSliderImages() {
    this.api.get('sliders/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.sliders = objects['sliders'];

        this.getSliderTypes();
      },
      async error => {
        alert(error);
      }
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
      name:  { 'en': this.slider.title_en, 'ar': this.slider.title_ar },
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
}
