import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-header',
  templateUrl: './setting-header.component.html',
  styleUrls: ['./setting-header.component.css']
})
export class SettingHeaderComponent implements OnInit {

  email: any;
  
  constructor() { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
  }

}
