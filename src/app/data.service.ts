import { Injectable } from '@angular/core';
import {IActualData} from "./_models/IActualData";
import {forkJoin, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Alert} from "./_classes/Alert";
import {UserConfigService} from "./user-config.service";

@Injectable({
  providedIn: 'root'
})
/**
 * https://www.sablatura.info/covid/api/
 */
export class DataService {
  cachedData: IActualData = null;
  cachedAlert: Alert = null;
  reproductionNumberDataSubscription: Observable<any> = null;
  casesDataSubscription: Observable<any> = null;
  joinSubscription: Observable<{data: IActualData, alert: Alert}> = null;

  constructor(
    private http: HttpClient,
    public userConfigService: UserConfigService,
  ) {

  }

  getActualData(): Observable<{data: IActualData, alert: Alert}>{
    // FIXME: ať zbytečne nevolám ty apička
    // let actualData =
    // {
    //   reproductionNumber: 1.2,
    //   reproductionNumberDate: "2020-05-23",
    //   totalCases: 8890,
    //   totalHeal: 6047,
    //   totalDeaths: 315,
    //   actualCases: 2528,
    //   casesDate: "",
    // };
    // let alert = new Alert(actualData, this.userConfigService.getUserConfig());
    // return of({data: actualData, alert: alert});

    /***************************************/

    if(this.cachedData !== null){
      return of({data: this.cachedData, alert: this.cachedAlert});
    }

    if(this.reproductionNumberDataSubscription === null){
      this.reproductionNumberDataSubscription = this.http.get('https://api.apify.com/v2/key-value-stores/DO0Mg4d1cPbWhtPSD/records/LATEST?disableRedirect=true');
    }

    if(this.casesDataSubscription === null) {
      this.casesDataSubscription = this.http.get('https://onemocneni-aktualne.mzcr.cz/api/v1/covid-19/nakazeni-vyleceni-umrti-testy.min.json');
    }

    if(this.joinSubscription === null){
      this.joinSubscription = forkJoin(this.reproductionNumberDataSubscription, this.casesDataSubscription).pipe(map(
        results => {
          if (results[0] && results[0].data && results[0].data[0]
            && results[1].data) {
            let r: number = results[0].data[0][3] as number;
            let rDate: string = results[0].data[0][0];
            let date = new Date();
            let dailyData: any;
            let totalCases: number = null;
            let totalHeal: number = null;
            let totalDeath: number = null;
            let totalTests: number = null;
            let cDate: string = null;
            // try to found last data
            for (let i = 0; i < 10; i++) {
              dailyData = results[1].data.find(d => d.datum === date.toISOString().substring(0, 10));
              if (dailyData) {
                totalCases = dailyData.kumulovany_pocet_nakazenych;
                totalHeal = dailyData.kumulovany_pocet_vylecenych;
                totalDeath = dailyData.kumulovany_pocet_umrti;
                totalTests = dailyData.kumulovany_pocet_provedenych_testu;
                cDate = dailyData.datum;
                break;
              }
              date.setDate(date.getDate() - 1);
            }
            if (!totalCases || !totalHeal || !totalDeath) {
              console.warn('API changed!!!');
              return null;
            }

            this.cachedData = {
              reproductionNumber: r,
              reproductionNumberDate: rDate,
              totalCases: totalCases,
              totalHeal: totalHeal,
              totalDeaths: totalDeath,
              actualCases: totalCases - totalHeal - totalDeath,
              casesDate: cDate,
            }

            //   console.log('XXXXXXXXXXXXXXXXXXXXXX cached data: ',this.cachedData);
            this.cachedAlert = new Alert(this.cachedData, this.userConfigService.getUserConfig());

            return {data: this.cachedData, alert: this.cachedAlert};
          } else {
            window.alert('Změnilo se api, ze kterého načítám data. Je potřeba mě překecat, abych to opravil.');
          }
        }
      ));
    }
    return this.joinSubscription;
  }

}
