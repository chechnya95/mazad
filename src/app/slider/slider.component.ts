import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../services/utilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  page = 1;
  pageSize = 10;

  list_length = 0;
  sliders: any[] = [];
  token: any;

  slider = {
    photo_number: null,
    photo__path: '',
    status:'',
  }

  
  new_slider = { 
    photo_number: null,
    photo__path: '',
    status:'',
}

new_slider_id: number = 0;
type: string = 'slider';
files: any;

  constructor(public utility: UtilitiesService, private modalService: NgbModal, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'] != null ? params['type'] : 'slider';
      this.getSliders();
    });
  }

  getSliders() {
    this.api.get('media/' + this.type, this.token).subscribe(
      async data => {
        let objects: any = {
          sliders: []
        }
        objects = data;

        this.sliders = objects.sliders;
        this.list_length = this.sliders.length;
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
      slider_type: this.type,
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

    this.modalService.dismissAll();
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
