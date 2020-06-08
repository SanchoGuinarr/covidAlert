import {Component, OnInit} from '@angular/core';
import {ContactsClustersService} from "../contacts-clusters.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Cluster, Person} from "../_classes/Person";

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
  CLUSTER = Cluster;
  private id: number;
  private person: Person;
  public form: FormGroup;

  constructor(
    public contactsClusters: ContactsClustersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    let cluster = parseInt(this.route.snapshot.paramMap.get('cluster'));
    if(this.id > 0) {
      this.person = this.contactsClusters.getPerson(this.id);
    }
    this.form = this.fb.group({
      name: [this.person ? this.person.name : '', Validators.required],
      risk: [this.person ? this.person.risk : 3],
      vulnerability: [this.person ? this.person.vulnerability : 3],
      cluster: [this.person
                  ? this.person.cluster
                  : isNaN(cluster)
                      ? Cluster.casual
                      : cluster
                ]
    });
  }

  save(){
    if(this.form.valid){
      let formValues = this.form.getRawValue();
      if(this.id === 0) {
        let id = this.contactsClusters.addPerson(formValues.cluster);
        this.person = this.contactsClusters.getCluster(formValues.cluster).get(id);
      }else {
        this.contactsClusters.movePerson(this.id, formValues.cluster);
      }
      this.person.name = formValues.name;
      this.person.risk = formValues.risk;
      this.person.vulnerability = formValues.vulnerability;
      this.person.cluster = formValues.cluster;
      this.contactsClusters.save();
      this.router.navigate(['/contacts']);
    }
  }

}
