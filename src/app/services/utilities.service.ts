import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  public url: any = '';
  public show: boolean = true;
  public loader: boolean = false;
  
  constructor() { }
}
