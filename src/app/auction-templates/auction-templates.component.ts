import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-auction-templates',
  templateUrl: './auction-templates.component.html',
  styleUrls: ['./auction-templates.component.css']
})
export class AuctionTemplatesComponent implements OnInit {

  token: any;
  templates: any[] = [];

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.title = 'Auction Templates';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  async getTemplates() {
    this.api.get('auction_templates/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
      },
      async error => {
        alert(error);
      }
    );
  }

  deleteTemplate(id: any) {
    if (confirm("Delete this template?")) {
      this.api.delete("auction_templates/" + id, this.token).subscribe(
        async data => {
          this.getTemplates();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  saveTemplate(item: any) {
    localStorage.removeItem('item-template');
    localStorage.setItem('item-template', JSON.stringify(item));
  }
}
