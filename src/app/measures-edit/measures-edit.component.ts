import { Component, OnInit } from '@angular/core';
import {UserConfigService} from "../user-config.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {Alert, AlertLevel} from "../_classes/Alert";
import {ContactsClustersService} from "../contacts-clusters.service";

@Component({
  selector: 'app-measures-edit',
  templateUrl: './measures-edit.component.html',
  styleUrls: ['./measures-edit.component.scss']
})
export class MeasuresEditComponent implements OnInit {
  constructor(
    public userConfigService: UserConfigService,
  ) {

  }

  ngOnInit() {
  }

  readonly ALERT_LEVEL = AlertLevel;
  alertLevels = Alert.captions;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  add(event: MatChipInputEvent, level: AlertLevel): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.userConfigService.getUserConfig().measures[level].push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.userConfigService.save();
  }

  remove(value, level: AlertLevel): void {
    const index = this.userConfigService.getUserConfig().measures[level].indexOf(value);

    if (index >= 0) {
      this.userConfigService.getUserConfig().measures[level].splice(index, 1);
    }
    this.userConfigService.save();
  }

}
