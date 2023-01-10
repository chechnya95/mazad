import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  token: any;
  id: any;
  user: any;
  image: any

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.title = 'My Profile';
    this.token = localStorage.getItem('access_token');
    this.id = localStorage.getItem('id');
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.api.get('users/my', this.token).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.user = objects.users;

        this.user.user_details = JSON.parse(this.user['user_details']);
        this.user.avatar = this.user.user_details ? this.user.user_details['name_en'].charAt(0) : this.user['username'].charAt(0);
        this.user.name = this.user.user_details ? this.user.user_details['name_en'] : '';
      },
      async error => { }
    );
  }

  imageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.image = fileList[0];
  }

  addIdImage() {
    let formData: FormData = new FormData();

    if (this.image) {
      formData.append('id_card_image', this.image, this.image.name);
      this.api.post_form("users/image", formData, this.token).subscribe(
        async data => { },
        async error => {
          Swal.fire({
            title: 'Error...',
            text: 'ERROR: cannot connect!\nPlease try again later.'
          });
        }
      );
    }
  }
}
