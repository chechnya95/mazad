import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  token: any;
  items: any[] = [];
  item_status: any[] = [];

  new_item_status: any;
  new_item_id: any;

  item_s = {
    name: null,
    order: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Auctions Items';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getItems();
  }

  async getItems() {
    this.utility.loader = true;
    this.api.get('items/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items'];

        localStorage.setItem('items', JSON.stringify(this.items));

        this.getItemstatus();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getItemstatus() {
    const sub = this.api.get('items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.item_status = objects.item_status;
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  deleteItem(id: number) {
    if (confirm("Delete this item?")) {
      this.api.delete("items/" + id, this.token).subscribe(
        async data => {
          this.getItems();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  update_item_status_clicked(id: any) {
    this.new_item_id = id;
  }

  updateItemStatus(item_id: any) {
    let body = { item_status: this.new_item_status }

    this.api.update('items/change_item_status/' + item_id, body, this.token).subscribe(
      async data => {
        this.getItems();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  updateItem(item_id: any) {
    let body = {}

    this.api.update('items/' + item_id, body, this.token).subscribe(
      async data => {
        this.getItems();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  saveItem(item: any) {
    localStorage.removeItem('item-edit');
    localStorage.setItem('item-edit', JSON.stringify(item));
  }
}
