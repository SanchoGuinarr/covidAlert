import {IActualData} from "../_models/IActualData";
import {IUserConfig} from "../_models/IUserConfig";


export enum AlertLevel{
  easy,
  prepare,
  reduce,
  restrict,
  lockdown
}

export class Alert{

  get alertNumber(): number {
    return this._alertNumber;
  }
  get level(): AlertLevel{
    return this._level;
  }
  get class(): string{
    return Alert.classes[this._level];
  }
  get caption(): string{
    return Alert.captions[this._level];
  }

  private _level: AlertLevel;
  private _alertNumber: number;
  public static readonly classes = [
      'alert-green',
      'alert-yellow',
      'alert-orange',
      'alert-red',
      'alert-dark-red'
    ];

  public static readonly captions = [
    'klid',
    'prevence',
    'snižování',
    'omezení',
    'lockdown'
  ]

  constructor(actualData: IActualData, userSettings: IUserConfig) {
    this._alertNumber = ((actualData.actualCases / 5) / 1000) + actualData.reproductionNumber;
    this.setAlertLevel(userSettings);
  }

  private setAlertLevel(userSettings: IUserConfig): void{
    if(this._alertNumber < userSettings.levelThresholds[0]){
      this._level = AlertLevel.easy;
      return;
    }
    if(this._alertNumber < userSettings.levelThresholds[1]){
      this._level = AlertLevel.prepare;
      return;
    }
    if(this._alertNumber < userSettings.levelThresholds[2]){
      this._level = AlertLevel.reduce;
      return;
    }
    if(this._alertNumber < userSettings.levelThresholds[3]){
      this._level = AlertLevel.restrict;
      return;
    }
    if(this._alertNumber >= userSettings.levelThresholds[3]){
      this._level = AlertLevel.lockdown;
      return;
    }
  }

}
