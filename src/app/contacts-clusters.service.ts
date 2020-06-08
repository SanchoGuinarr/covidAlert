import {Injectable} from '@angular/core';
import {Cluster, Person} from "./_classes/Person";
import {AlertLevel} from "./_classes/Alert";
import {UserConfigService} from "./user-config.service";
import {DataService} from "./data.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

interface SavedData {
  contactCluster: any[][][],
  actions: string[][],
  maxId: number;
  lastEdit: string;
}

export enum Actions {
  work,
  publicTransport,
  publicPlace,
  massAction,
}

@Injectable({
  providedIn: 'root'
})
export class ContactsClustersService {
  public contactCluster: Map<number,Person>[];
  public actions: Map<Actions,Date[]>;
  private maxId = 0;
  private lastEdit: Date;

  private meetMessages = [
    "Můžeš mezi lidi.",
    "Navštiv známé a kamarády.",
    "Navštiv kamarády.",
    "Navštiv nejbližší.",
    "Zůstaň doma.",
  ];

  constructor(
    public userConfigService: UserConfigService,
    public dataService: DataService,
  ) {
    this.load();
  }

  public getCluster(cluster: Cluster): Map<number,Person>{
    return this.contactCluster[cluster];
  }

  public getClustersArray(): Cluster[] {
    return [Cluster.home, Cluster.close, Cluster.casual,  Cluster.work, Cluster.other];
  }

  public getActionsArray(): Actions[]{
    return [Actions.work, Actions.publicTransport, Actions.publicPlace, Actions.massAction];
  }


  public getClusterCaption(cluster: Cluster): string{
    switch (cluster) {
      case Cluster.home:
        return "Doma";
      case Cluster.close:
        return "Rodina + blízcí";
      case Cluster.casual:
        return "Kamarádi";
      case Cluster.work:
        return "Práce";
      case Cluster.other:
        return "Ostatní";
    }
  }

  public getActivityCaption(action: Actions){
    switch (action) {
      case Actions.massAction:
        return "Hromadná akce";
      case Actions.publicPlace:
        return "Veřejné místo";
      case Actions.publicTransport:
        return "MHD";
      case Actions.work:
        return "Práce";
    }
  }

  public addPerson(cluster: Cluster): number{
    let id = ++this.maxId;
    let person = new Person(id);
    person.cluster = cluster;
    this.contactCluster[cluster].set(id,person);
    return this.maxId;
  }

  public getPerson(id: number): Person{
    for(let i = 0; i < 5; i++){
      if(this.contactCluster[i].has(id)){
        return this.contactCluster[i].get(id);
      }
    }
    return null;
  }

  public movePerson(id: number, cluster: Cluster): void{
    let person: Person;
    for(let i = 0; i < 5; i++){
      if(this.contactCluster[i].has(id)){
        person = this.contactCluster[i].get(id);
        this.contactCluster[i].delete(id);
      }
    }
    if(person){
      this.contactCluster[cluster].set(id, person);
    }
  }

  public computeMeetIndex(): number{
    //TODO: tady ten výpočet je k revizi, je to první verze
    let dates: Date[] = [];
    let today = new Date();

    for(let i = 0; i < 5; i++){
      let date = new Date();
      date.setDate(today.getDate() - i);
      dates[i] = date;
    }
    let index = 0;
    for(let i = 0; i < 5; i++){
      this.contactCluster[i].forEach(person => {
        for(let i = 0; i < 5; i++) {
          if (person.interactions.find(interactionDate => dates[i].toDateString === interactionDate.toDateString)) {
            index += ((1 / (i + 1)) * (0.2 * person.risk));
            // console.log('Přičítám osobu: '+person.name+" datum: "+dates[i].toDateString()
            //   +" pozice data: "+i+" riziko: "+person.risk+" výsledek: "
            //   + ((1 / (i + 1)) * (0.2 * person.risk)));
            break;
          }
        }
      });
    }
    // TODO: a toto je ještě větší magie
    this.getActionsArray().forEach(action => {
      for(let i = 0; i < 5; i++) {
        if (this.actions.get(action).find(interactionDate => dates[i].toDateString === interactionDate.toDateString)) {
          index += (1 / (i + 1)) * action * 3;
          // console.log('Přičítám akci: '+this.getActivityCaption(action)+" datum: "+dates[i].toDateString()
          //   +" pozice data: "+i+" výsledek: "+ (1 / (i + 1)) * action * 3);
          break;
        }
      }
    });

    return Math.round(index);
  }

  public getMeetMessage(): Observable<string>{
    let meetIndex = this.computeMeetIndex();
    return this.dataService.getActualData().pipe(map(data => {
        switch (data.alert.level) {
          case AlertLevel.easy:
            if(meetIndex < 5){
              return  this.meetMessages[0];
            }else if(meetIndex < 10){
              return  this.meetMessages[1];
            }else{
              return  this.meetMessages[2];
            }
          case AlertLevel.prepare:
            if(meetIndex < 5){
              return  this.meetMessages[1];
            }else if(meetIndex < 10){
              return  this.meetMessages[2];
            }else{
              return  this.meetMessages[3];
            }
          case AlertLevel.reduce:
            if(meetIndex < 5){
              return  this.meetMessages[2];
            }else if(meetIndex < 10){
              return  this.meetMessages[3];
            }else{
              return  this.meetMessages[4];
            }
          case AlertLevel.restrict:
            if(meetIndex < 5){
              return  this.meetMessages[3];
            }else{
              return  this.meetMessages[4];
            }
          case AlertLevel.lockdown:
            return  this.meetMessages[4];
        }
      }
    ));
  }

  public save(): void{
    let contacts: any[][][] = [];
    for(let i = 0; i < 5; i++){
      contacts[i] = [];
      this.contactCluster[i].forEach((person, id) =>{
        contacts[i].push([id,person.fetchData()]);
      });
    }
    let actions: string[][] = [];
    this.getActionsArray().forEach(i => {
      actions[i] = this.actions.get(i).map(d => d.toISOString());
    });

    let savedData: SavedData = {
      contactCluster: contacts,
      actions: actions,
      maxId: this.maxId,
      lastEdit: this.lastEdit.toISOString(),
    };
    localStorage.setItem("savedata",JSON.stringify(savedData));
  }

  private load(){
    this.contactCluster = [];
    let stored = localStorage.getItem("savedata");
    if(stored) {
      let data: SavedData = JSON.parse(localStorage.getItem("savedata"));
      for(let i = 0; i < 5; i++){
        this.contactCluster[i] = new Map();
        data.contactCluster[i].forEach(p => {
          this.contactCluster[i].set(p[0], new Person(p[0], p[1]));
        });
      }
      this.maxId = data.maxId;
      this.lastEdit = new Date(data.lastEdit);
      this.actions = new Map<Actions, Date[]>();
      this.getActionsArray().forEach(i => {
        this.actions.set(i, data.actions[i].map(d => new Date(d)));
      });
    }else{
      this.contactCluster = [
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
      ];

      this.contactCluster[Cluster.home].set(1,new Person(1, {id: 1, name: "Máma", cluster: Cluster.home, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.home].set(2,new Person(2, {id: 2, name: "Táta", cluster: Cluster.home, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.close].set(3,new Person(3, {id: 3, name: "Best kámoš", cluster: Cluster.close, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.close].set(4,new Person(4, {id: 4, name: "Děda", cluster: Cluster.close, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.casual].set(5,new Person(5, {id: 5, name: "Kámoš", cluster: Cluster.casual, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.work].set(6,new Person(6, {id: 6, name: "Jarda", cluster: Cluster.work, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.work].set(7,new Person(7, {id: 7, name: "Karel", cluster: Cluster.work, risk: 3, vulnerability: 3, interactions: []}));
      this.contactCluster[Cluster.other].set(8,new Person(8, {id: 8, name: "Kadeřník", cluster: Cluster.work, risk: 3, vulnerability: 3, interactions: []}));

      this.lastEdit = new Date();
      this.maxId = 8;
      this.actions = new Map();
      this.getActionsArray().forEach(i => {
        this.actions.set(i, []);
      });
    }
  }
}
