export enum Cluster {
  home,  // everyday interaction (same family)
  close,  // close interaction, almost everyday
  work,   // close interaction in work
  casual, // close interaction, but not everyday base (relatives, cooworkers)
  other,  // occasional close interaction (other)
}

export interface IPerson{
  id: number;
  name: string;
  risk: number;
  vulnerability: number;
  cluster: Cluster;
  interactions: string[];
}

export class Person{

  private readonly _id: number;
  private _name: string;
  private _risk: number; // 1 - 5
  private _vulnerability: number; // 1 - 5
  private _cluster: Cluster;
  private _interactions: Date[];

  constructor(id: number, person?: IPerson) {
    if(person){ // from existing data
      this._id = person.id;
      this.name = person.name;
      this.risk = person.risk;
      this.vulnerability = person.vulnerability;
      this.cluster = person.cluster;
      this.interactions = person.interactions.map(d => new Date(d));
    }else{ // new person
      this._id = id;
      this._interactions = [];
    }
  }

  get interactions(): Date[] {
    return this._interactions;
  }

  set interactions(value: Date[]) {
    this._interactions = value;
  }
  get cluster(): Cluster {
    return this._cluster;
  }

  set cluster(value: Cluster) {
    this._cluster = value;
  }
  get vulnerability(): number {
    return this._vulnerability;
  }

  set vulnerability(value: number) {
    this._vulnerability = value;
  }
  get risk(): number {
    return this._risk;
  }

  set risk(value: number) {
    this._risk = value;
  }
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
  get id(): number {
    return this._id;
  }

  fetchData(): IPerson{
    return {
      id: this.id,
      name: this.name,
      risk: this.risk,
      vulnerability: this.vulnerability,
      cluster: this.cluster,
      interactions: this.interactions.map(date => date.toISOString()),
    }
  }

  setInteraction(date: Date, checked: boolean) {
    if(checked){
      if(!this.interactions.find(d => d.toDateString() === date.toDateString())){
        this.interactions.push(date);
      }
    }else{
      if(this.interactions.find(d => d.toDateString() === date.toDateString())) {
        this.interactions = this.interactions.filter(d => d.toDateString() !== d.toDateString())
      }
    }
  }
}
