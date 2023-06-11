import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  server: string = environment.server;
  api: string = environment.API_URL;
  website: string = environment.website;

  constructor(private httpClient: HttpClient, public router: Router) { }

  get(method: string, token: any, options?: {}) {
    
    // Add token to exisiting headers 
    if (options) {
      options['headers'] = { 'x-access-tokens': token };
    } else {
      options = { headers: { 'x-access-tokens': token } };
    }    

    //console.log('options', options);
    return this.httpClient.get(this.api + method, options);
  }

  post(method: string, body: any, token: any) {
    const requestOptions = {
      headers: { 'Content-Type': 'application/json', 'x-access-tokens': token }
    };

    return this.httpClient.post(this.api + method, JSON.stringify(body), requestOptions);
  }

  post_form(method: any, body: any, token: any) {
    const requestOptions = {
      headers: { 'x-access-tokens': token }
    };

    return this.httpClient.post(this.api + method, body, requestOptions);
  }

  delete(method: string, token: any) {
    const requestOptions = {
      headers: { 'Content-Type': 'application/json', 'x-access-tokens': token }
    };

    return this.httpClient.delete(this.api + method, requestOptions);
  }

  update(method: string, body: any, token: any) {
    const requestOptions = {
      headers: { 'Content-Type': 'application/json', 'x-access-tokens': token }
    };

    return this.httpClient.patch(this.api + method, JSON.stringify(body), requestOptions);
  }

  update_form(method: any, body: any, token: any) {
    const requestOptions = {
      headers: { 'x-access-tokens': token }
    };

    return this.httpClient.patch(this.api + method, body, requestOptions);
  }

  upload(method: any, formData: FormData) {
    let type = 'multipart/form-data';
    let accept = 'application/json';

    const options = {
      headers: { 'Content-Type': type, 'Accept': accept }
    };

    return this.httpClient.post(this.api + method, formData, {});
  }

  login(body: any, method: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(body['email'] + ":" + body['password'])
      })
    };

    const loginParams = Object.keys(body).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
    }).join('&');

    return this.httpClient.post(this.api + method, loginParams, httpOptions);
  }

  setToken(data: any) {
    let user_details = JSON.parse(data['user_details']);

    /* encrpt the role */
    let role = 'bd55474ed5d44d1e81268b5be089b51sq17f' + data['role'].toLowerCase() + 'u0pgbd55474ed5d44d1e81268b5be089b51';

    localStorage.setItem("user_key", role);
    localStorage.setItem("access_token", data['token']);
    localStorage.setItem("is_valid", 'true');
    localStorage.setItem("type", data['type']);
    localStorage.setItem("id", data['id']);
    localStorage.setItem("name", user_details ? user_details.name_en : data['email'].substr(0, data['email'].indexOf('@')));
    localStorage.setItem("email", data['email']);

    this.router.navigate(['login']);
  }

  isTokenExpired() {
    let token = localStorage.getItem("access_token");
    let decoded = null;

    if (token)
      decoded = jwt_decode(token);

    let valid = false;

    if (decoded)
      valid = decoded['exp'] < Date.now() / 1000;

    return valid;
  }

  isExpiredWorker() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./app.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        localStorage.setItem("is_valid", data);
        console.log(`page got message: ${data}`);
      };

      let token = localStorage.getItem("access_token");
      worker.postMessage(token);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  gettoken() {
    return !!localStorage.getItem("access_token");
  }

  isAllowed(roles: any) {
    let token = localStorage.getItem("access_token");
    let valid = localStorage.getItem("is_valid");

    if (token && valid)
      if (valid == 'true')
        if (this.canEnter(roles))
          return true;

    return false;
  }

  canEnter(roles: any) {
    let user_key = localStorage.getItem("user_key");
    let role = null;

    if (user_key)
      role = user_key.split('f').pop().split('u')[0];

    if (role && roles.includes(role.toLowerCase()))
      return true;

    return false;
  }
}
