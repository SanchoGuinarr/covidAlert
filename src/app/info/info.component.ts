import { Component, OnInit } from '@angular/core';
import {Alert} from "../_classes/Alert";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  public readonly ALERT = Alert;

  constructor() { }

  ngOnInit() {
  }

}
