import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  medias: any[] = [];
  token: any;

  media = {
    media_type: null
  }

  new_slider_id: number = 0;
  files: any;

  constructor(public utility: UtilitiesService, public api: ApiService) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getMedias();
  }

  getMedias() {
    this.api.get('medias/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.medias = objects['medias'];

        for (let i = 0; i < this.medias.length; i++) {
          this.medias[i].path = this.api.server + "uploads/media/" + this.medias[i].upload_file;
        }
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

      this.api.upload("medias/files-upload/media/" + this.media.media_type, formData).subscribe(
        async data => {
          let response = JSON.parse(JSON.stringify(data));
          console.log(response)
        },
        async error => {
          console.log("POST medias: " + error);
        }
      );
    }
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    this.files = fileList;
  }
}
