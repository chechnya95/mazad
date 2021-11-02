import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  
  sliders: any[] = [];
  token: any;

  slider = {
    photo_number: null,
    photo__path: '',
    status: '',
  }

  new_slider = {
    photo_number: null,
    photo__path: '',
    status: '',
  }

  new_slider_id: number = 0;
  files: any;

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getSliders();
  }

  getSliders() {
    this.api.get('media/', this.token).subscribe(
      async data => {
        let objects: any = {
          sliders: []
        }
        objects = data;

        this.sliders = objects.sliders;
      },
      async error => {
        alert(error);
      }
    );
  }

  async OnSubmit() {
    let formData: FormData = new FormData();

    if (this.files && this.files.length > 0) {
      for (let file of this.files) {
        formData.append('files', file, file.name);
      }

      this.api.upload("medias/files-upload/slider/1", formData).subscribe(
        async data => {
          let response = JSON.parse(JSON.stringify(data));
          let contract_file = response.medias[0];

          this.slider.photo__path = this.api + "uploads/media/" + contract_file['upload_file'];
          this.submitSlider(this.slider.photo__path);
        },
        async error => {
          console.log("POST medias: " + error);
        }
      );
    }
    else {
      this.submitSlider(null);
    }
  }

  submitSlider(path: any) {
    const body = {
      photo_number: this.slider.photo_number,
      slider_type: null,
      photo__path: path
    }
    this.api.post("slider/", body, this.token).subscribe(
      async data => {
        this.getSliders();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    this.files = fileList;
  }

  isAdmin() {
    let role = localStorage.getItem('role');

    if (role === 'admin')
      return true;
    return false;
  }
}
