import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.css']
})
export class OwnersComponent implements OnInit {

  token: any;
  owners: any[] = [];

  owner = {
    email: null,
    phone: null,
    code: null,
  }

  edit_owner_id: any;
  edit_owner = {
    email: null,
    code: null,
    phone: null,
    active: 0
  }

  owner_details = {
    name_ar: null,
    name_en: null,
    id_card_number: null
  }

  edit_owner_details = {
    name_ar: null,
    name_en: null,
    id_card_number: null
  }

  ownerFilter = '';

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Owners';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getOwners(id);
      }
      else { this.getOwners(null); }
    })
  }

  async getOwners(id: any) {
    this.utility.loader = true;
    const sub = this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = {
          owners: []
        }
        objects = data;

        this.owners = objects.owners;

        if (id)
          this.owners = this.owners.filter(i => i.id === id);

        this.owners.forEach(function (owner) {
          let owner_details = JSON.parse(owner['owner_details']);

          owner.avatar = owner_details ? owner_details['name_en'] ? owner_details['name_en'].charAt(0) : owner['ownername'].charAt(0) : owner['ownername'].charAt(0);
          owner.name = owner_details ? owner_details['name_en'] : '';
        });
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  OnSubmit() {
    let body = {
      email: this.owner.email,
      password: this.owner.code,
      phone: this.owner.phone,
      owner_details: JSON.stringify(this.owner_details)
    }

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.owner.email == '') {
      alert('No enough data');
    }
    else if (emailPattern.test(String(this.owner.email).toLowerCase()) != true) {
      alert('email is not correct!');
    }
    else {
      this.api.post("owners/", body, this.token).subscribe(
        async data => {
          this.getOwners(null);
        },
        async error => {
          alert("ERROR: cannot connect!\nPlease Note: (email) and (phone) cannot be duplicated!");
        }
      );
    }
  }

  deleteOwner(id: number) {
    if (confirm("Delete this Owner?")) {
      this.api.delete("owners/" + id, this.token).subscribe(
        async data => {
          this.getOwners(null);
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  editOwnerClicked(owner: any) {
    this.edit_owner = owner;
    this.edit_owner_id = owner.id;

    if (this.edit_owner['owner_details'])
      this.edit_owner_details = JSON.parse(this.edit_owner['owner_details']);

    this.edit_owner.active = owner.active == true ? 1 : 0;
  }

  OnUpdate(id: any) {
    let body = {
      owner_details: JSON.stringify(this.edit_owner_details),
      code: this.edit_owner.code,
      active: this.edit_owner.active,
      email: this.edit_owner.email,
      phone: this.edit_owner.phone
    }

    const sub = this.api.update('owners/' + id, body, this.token).subscribe(
      async data => { },
      async errr => { console.log(errr); }
    );

    sub.add(() => { this.getOwners(null); });
  }
}
