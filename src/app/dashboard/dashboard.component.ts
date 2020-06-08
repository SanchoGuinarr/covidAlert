import { Component, OnInit } from '@angular/core';
import {UserConfigService} from "../user-config.service";
import {DataService} from "../data.service";
import {IActualData} from "../_models/IActualData";
import {Alert, AlertLevel} from "../_classes/Alert";
import {ContactsClustersService} from "../contacts-clusters.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly ALERT_LEVEL = AlertLevel;
  alert: Alert;
  actualData: IActualData;
  meetMessage: string;
  meetIndex: number;

  constructor(
    public dataService: DataService,
    public userConfigService: UserConfigService,
    public contactsClustersService: ContactsClustersService,
  ) { }

  ngOnInit() {
    this.dataService.getActualData().subscribe(next => {
      this.actualData = next.data;
      this.alert = next.alert;
    });

    this.contactsClustersService.getMeetMessage().subscribe(next => {
      this.meetMessage = next;
    });

    this.meetIndex = this.contactsClustersService.computeMeetIndex();
  }

}
