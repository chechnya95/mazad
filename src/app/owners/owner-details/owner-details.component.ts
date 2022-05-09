import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrls: ['./owner-details.component.css']
})
export class OwnerDetailsComponent implements OnInit {

  token: any;

  auctions: any[] = [];
  users: any[] = [];
  owner_users: any[] = [];
  owner: any;

  user_id: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Owner Details';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        let objects = localStorage.getItem('owners') ? JSON.parse(localStorage.getItem('owners')) : null;
        if (objects) {
          this.owner = objects.find(i => i.id === id);

          this.owner.details = JSON.parse(this.owner.owner_details);
          this.getOwnerUsers();
        }
      }
      else { this.router.navigate(['items']); }
    })
  }

  async getUsers() {
    this.api.get('users/', this.token).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.users.forEach(function (user) {
          user.contact = user.email ? user.email : user.phone;
        });
      },
      async error => {
        alert(error);
      }
    );
  }

  getOwnerUsers() {
    this.utility.loader = true;
    const sub = this.api.get('owners/owner_user/' + this.owner.id, this.token).subscribe(
      async data => {
        let objects: any = {
          owner_user: []
        }
        objects = data;
        this.owner_users = objects.owner_user;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );

    sub.add(() => { this.utility.loader = false; this.getUsers(); });
  }

  linkUser(id: any) {
    let body = {
      user_id: this.user_id,
      owner_id: id
    }
    this.api.post('owners/owner_user', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getOwnerUsers();
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  deleteOwnerUser(id: any) {
    this.api.delete("owners/owner_user/" + id, this.token).subscribe(
      async data => {
        this.getOwnerUsers();
      },
      async error => {
        this.errorMessage = true;
        console.log(error);
      }
    );
  }
}
