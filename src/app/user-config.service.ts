import { Injectable } from '@angular/core';
import {IUserConfig} from "./_models/IUserConfig";

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  userConfig: IUserConfig;

  constructor() {
    this.load();
  }

  getUserConfig():IUserConfig{
    return this.userConfig;
  }

  getMeasuresForLevel(alertLevel): string[]{
    return this.userConfig.measures[alertLevel];
  }

  load(){
    let stored = localStorage.getItem("userConfig");
    if(stored) {
      this.userConfig = JSON.parse(stored);
    }else{
      this.userConfig = {
        levelThresholds: [1.5,1.75,2,2.25],
        measures: [
          ['bez omezení'],
          ['homeoffice 2 dny','rouška','nepoužívat pravidelně hromadnou dopravu','nepořádat akce nad 10 lidí'],
          ['homeoffice 3 dny','nepoužívat pravidelně hromadnou dopravu'],
          ['bez hromadné dopravy','100% homeoffice'],
          ['lockdown','jen rodinný cluster','bez hromadné dopravy','100% homeoffice'],
        ]
      }
    }
  }

  save(){
    localStorage.setItem("userConfig",JSON.stringify(this.userConfig));
  }
}
