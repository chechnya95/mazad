import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MazadService {

  token: any;
  public roles: any[] = [];

  constructor(private api: ApiService) {
    this.token = localStorage.getItem('access_token');
  }

  async getRoles() {
    this.api.get('users/roles', this.token).subscribe(
      async data => {
        let objects: any = {
          roles: []
        }
        objects = data;
        this.roles = objects.roles;
        localStorage.setItem('roles', JSON.stringify(this.roles));
      },
      async error => {
        alert(error);
      }
    );
  }
}
