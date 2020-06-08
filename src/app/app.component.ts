import { Component } from '@angular/core';
import {ContactsClustersService} from "./contacts-clusters.service";
import {Alert} from "./_classes/Alert";
import {IActualData} from "./_models/IActualData";
import {DataService} from "./data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'COVID VAROVÁNÍ CZ';
  alert: Alert;
  actualData: IActualData;

  constructor(
    public contactsClusters: ContactsClustersService,
    public dataService: DataService,
  ) {
    this.dataService.getActualData().subscribe(next => {
      this.actualData = next.data;
      this.alert = next.alert;
    });
  }

  save() {
    this.contactsClusters.save();
  }
}
