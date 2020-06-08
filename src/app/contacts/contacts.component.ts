import { Component, OnInit } from '@angular/core';
import {ContactsClustersService} from "../contacts-clusters.service";
import {Cluster, Person} from "../_classes/Person";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  readonly CLUSTER = Cluster;

  constructor(
    public contactsClusters: ContactsClustersService,
    public router: Router,

  ) {

  }

  ngOnInit() {
  }

  edit(id: number) {
    this.router.navigate(['/contact-edit', id]);
  }

  add(cluster: Cluster) {
    this.router.navigate(['/contact-edit',0,{cluster: cluster}]);
  }
}
