import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  token: any;
  id: any;
  user: any;

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
      async error => {
        alert(error);
      }
    );
  }
}
