import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  token: any;
  wallets: any[] = [];

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Wallets Page';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getWallets();
  }

  getWallets() {
    this.utility.loader = true;
    const sub = this.api.get('wallets/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.wallets = objects['wallets'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

}
