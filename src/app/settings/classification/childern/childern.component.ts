import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-childern',
  templateUrl: './childern.component.html',
  styleUrls: ['./childern.component.css']
})
export class ChildernComponent implements OnInit {

  token: any;

  classifications: any[] = [];
  parent: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let parent = params['parent'] != null ? params['parent'] : null;
      if (parent) {
        this.getClassificationDependecnies(parent);
      }
      else { this.router.navigate(['classifications']); }
    })
  }

  getClassificationDependecnies(parent_id: any) {
    this.api.get('classifications/dependencies/' + parent_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.classifications = objects['dependencies'];
        this.parent = objects['classification'][0];
      },
      async error => {
        alert(error);
      }
    );
  }
}
