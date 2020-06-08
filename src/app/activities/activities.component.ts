import {Component, OnInit} from '@angular/core';
import {Actions, ContactsClustersService} from "../contacts-clusters.service";
import {Cluster} from "../_classes/Person";

export const WeekDays = [
  'neděle',
  'pondělí',
  'úterý',
  'středa',
  'čtvrtek',
  'pátek',
  'sobota',
]

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  readonly CLUSTER = Cluster;
  readonly columnsNumber = 5;
  dates: {caption: string; date: Date}[] = [];
  data = [[],[],[],[],[]];
  displayedColumns: any;
  activitiesData = [];

  constructor(
    public contactsClusters: ContactsClustersService,
  ) {
    let today = new Date();
    for(let i = 0; i < this.columnsNumber; i++){
      let date = new Date();
      date.setDate(today.getDate() - i);
      let caption;
      if(i === 0){caption = 'dnes';}
      else if(i === 1){caption = 'včera';}
      else{caption = WeekDays[date.getDay()];}
      this.dates[i] = {caption, date};
    }

    this.displayedColumns = ['name'];
    this.dates.forEach(date => {
      this.displayedColumns.push(date.caption);
    });

    // Data pro osoby
    this.contactsClusters.getClustersArray().forEach(cluster => {
      let i = 0;
      this.contactsClusters.getCluster(cluster).forEach(person => {
          this.data[cluster][i] = {};
          this.data[cluster][i].name = person.name;
          this.data[cluster][i].id = person.id;
          this.dates.forEach(date => {
            this.data[cluster][i][date.caption] = !!person.interactions.find(d => d.toDateString() === date.date.toDateString());
          });
          i++;
        }
      );
    });

    // data pro aktivity
    this.contactsClusters.getActionsArray().forEach(i => {
      this.activitiesData[i] = {};
      this.activitiesData[i].name = this.contactsClusters.getActivityCaption(i);
      this.activitiesData[i].id = i;
      this.dates.forEach(date => {
        this.activitiesData[i][date.caption] = this.contactsClusters.actions.get(i).find(d => d.toDateString() === date.date.toDateString());
      });
    });


    console.log('XXXXXXXXXXXXXXXXXXXXXX data: ',this.data);
  }

  ngOnInit() {
  }

  select(id: number, date: Date, checked: boolean) {
    let person = this.contactsClusters.getPerson(id);
    person.setInteraction(date, checked);
    this.contactsClusters.save();
  }

  selectActivity(activity: Actions, date: Date, checked: boolean) {
    if(checked){
      if(!this.contactsClusters.actions.get(activity).find(d => d.toDateString() === date.toDateString())){
        this.contactsClusters.actions.get(activity).push(date);
      }
    }else{
      if(this.contactsClusters.actions.get(activity).find(d => d.toDateString() === date.toDateString())) {
        this.contactsClusters.actions.set(activity,this.contactsClusters.actions.get(activity).filter(d => d.toDateString() !== d.toDateString()));
      }
    }
    if(activity === Actions.work) {
      this.data[Cluster.work].forEach((value, key) => {
        this.dates.forEach(d => {
          if (d.date === date) {
            this.data[Cluster.work][key][d.caption] = checked;
            this.select(this.data[Cluster.work][key].id, date, checked);
          }
        });
      });
    }
    this.contactsClusters.save();
  }
}
