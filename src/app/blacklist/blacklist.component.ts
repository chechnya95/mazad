import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit {

  token: any;
  blacklists: any[] = [];
  users: any[] = [];
  owners: any[] = [];

  blacklist = {
    user_id: null,
    owner_id: null
  }

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Blacklists';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getBlackLists(id);
      }
      else { this.getBlackLists(null); }
    })
  }

  getBlackLists(id: any) {
    this.utility.loader = true;
    const sub = this.api.get('blacklists/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.blacklists = objects['blacklists']['blacklists'];

        localStorage.setItem('blacklists', JSON.stringify(this.blacklists));

        if (id)
          this.blacklists = this.blacklists.filter(i => i.id === id);
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; this.getUsers() });
  }

  OnSubmit() {
    let body = {
      user_id: this.blacklist.user_id == 0 ? null : this.blacklist.user_id,
      owner_id: this.blacklist.owner_id == 0 ? null : this.blacklist.owner_id
    }
    this.api.post('blacklists/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getBlackLists(null);
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  async getUsers() {
    const sub = this.api.get('users/', this.token).subscribe(
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

    sub.add(() => { this.getOwners(); });
  }

  async getOwners() {
    const sub = this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = {
          owners: []
        }
        objects = data;

        this.owners = objects.owners;
        this.owners.forEach(function (owner) {
          owner.contact = owner.email ? owner.email : owner.phone;
        });
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { });
  }

  removeBlock(id: any) {
    this.api.delete('blacklists/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getBlackLists(null);
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }
}
