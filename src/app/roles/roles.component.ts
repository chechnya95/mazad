import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  token: any;
  roles: any[] = [];
  permissions: any[] = [];

  permission_name: string = '';
  role_name: string = '';

  edit_role_id: number = 0;
  edit_role_name: string = '';

  permissions_checked: any[] = [];
  role_permissons: any[] = [];

  add_role_permission: any[] = [];

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getRoles();
  }

  async getRoles() {
    this.utility.loader = true;
    this.api.get('users/roles', this.token).subscribe(
      async data => {
        let objects: any = {
          roles: []
        }
        objects = data;
        this.roles = objects.roles;

        this.getPermissions();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getPermissions() {
    this.api.get('users/permissions', this.token).subscribe(
      async data => {
        let objects: any = {
          permissions: []
        }
        objects = data;
        this.permissions = objects.permissions;

        this.permissions.forEach(function (permission) {
          let split: string[] = permission.name.split(".");
          permission.obj = split[0];
          permission.action = permission.name.replace(permission.obj+'.', '');
        });

        this.getRolePermissions();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getRolePermissions() {
    this.api.get('users/roles-permissions', this.token).subscribe(
      async data => {
        let objects: any = {
          roles_permissions: []
        }
        objects = data;
        this.role_permissons = objects.roles_permissions;

        this.utility.loader = false;
      },
      async error => {
        alert(error);
      }
    );
  }

  addRole() {
    let body = {
      name: this.role_name,
    }

    if (this.role_name != '') {
      this.api.post("users/roles", body, this.token).subscribe(
        async data => {
          let response = JSON.parse(JSON.stringify(data));
          for (let i = 0; i < this.add_role_permission.length; i++) {
            let body = { role_id: response['role_id'], permission_id: this.add_role_permission[i].id }
            console.log(body);
            this.api.post("users/add-permission", body, this.token).subscribe(
              async data => {
                //console.log('ok');
              },
              async error => {
                console.log(error);
              }
            );
          }
          this.getRoles();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  addCheckBoxChecked(permision: any) {
    if (permision.checked) {
      this.add_role_permission.push(permision);
    }
    else {
      const index = this.add_role_permission.indexOf(permision, 0);
      if (index > -1) {
        this.add_role_permission.splice(index, 1);
      }
    }
  }

  addPermission() {
    let body = {
      name: this.permission_name,
    }

    if (this.permission_name != '') {
      this.api.post("users/permissions", body, this.token).subscribe(
        async data => {
          this.getPermissions();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  addRoleClicked() {
    this.permissions.forEach(function (permission) {
      permission.checked = false;
    });
  }

  editRoleClicked(id: number, name: string) {
    this.edit_role_name = name;
    this.edit_role_id = id;

    this.permissions.forEach(function (permission) {
      permission.checked = false;
    });

    for (let x = 0; x < this.permissions.length; x++) {
      for (let y = 0; y < this.role_permissons.length; y++) {
        if (this.role_permissons[y].role_id == this.edit_role_id) {
          if (this.permissions[x].id == this.role_permissons[y].permission_id) {
            this.permissions[x].checked = true;
          }
        }
      }
    }
  }

  checkBoxChecked(permision: any) {
    if (permision.checked) {
      let body = { role_id: this.edit_role_id, permission_id: permision.id }
      this.api.post("users/add-permission", body, this.token).subscribe(
        async data => {
          //console.log('ok');
        },
        async error => {
          alert("ERROR");
          console.log(error);
        }
      );
    }
    else {
      this.api.delete("users/delete-role-permission/" + this.edit_role_id + "/" + permision.id, this.token).subscribe(
        async data => {
          //console.log('deleted');
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  updateRole(id: number) {
    let role_name = this.roles.find(i => i.id == id).name;

    if (role_name != this.edit_role_name) {
      alert('hi')
      let body = { name: this.edit_role_name }

      this.api.update("users/roles/" + this.edit_role_id, body, this.token).subscribe(
        async data => {
          //this.updateRolesPermissions(this.edit_role_id);
          this.getRoles();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  updateRolesPermissions(this_role_id: number) {
    let permissions = this.permissions.filter(i => i.checked == true);

    for (let i = 0; i < permissions.length; i++) {
      let body = { role_id: this_role_id, permission_id: permissions[i].id }
      this.api.post("users/add-permission", body, this.token).subscribe(
        async data => {
          console.log('ok');
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }
}
